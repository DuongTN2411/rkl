const { Op } = require('sequelize');
const {
  sequelize,
  Project,
  ProjectMember,
  Task,
  Attachment,
  User,
} = require('../models');
const { USER_PUBLIC_ATTRIBUTES } = require('../constants');
const AppError = require('../utils/AppError');
const { getPagination, buildMeta } = require('../utils/pagination');
const { removeUploadedFile } = require('../utils/files');

const ownerInclude = {
  model: User,
  as: 'owner',
  attributes: USER_PUBLIC_ATTRIBUTES,
};

const membersInclude = {
  model: User,
  as: 'members',
  attributes: USER_PUBLIC_ATTRIBUTES,
  through: { attributes: [] },
};

const withRole = (project, userId) => {
  const data = project.toJSON ? project.toJSON() : project;
  return {
    ...data,
    role: data.ownerId === userId ? 'owner' : 'member',
  };
};

const getProjectDetail = async (projectId, userId) => {
  const project = await Project.findByPk(projectId, {
    include: [ownerInclude, membersInclude],
  });

  if (!project) {
    throw new AppError(404, 'Không tìm thấy dự án');
  }

  return withRole(project, userId);
};

const createProject = async (ownerId, payload) => {
  const transaction = await sequelize.transaction();
  let projectId;

  try {
    const project = await Project.create(
      {
        name: payload.name.trim(),
        description: payload.description ?? null,
        startDate: payload.startDate ?? null,
        endDate: payload.endDate ?? null,
        ownerId,
      },
      { transaction }
    );

    await ProjectMember.create(
      { projectId: project.id, userId: ownerId },
      { transaction }
    );

    await transaction.commit();
    projectId = project.id;
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    throw error;
  }

  return getProjectDetail(projectId, ownerId);
};

const listProjects = async (userId, query) => {
  const { page, limit, offset } = getPagination(query, 20);

  const memberships = await ProjectMember.findAll({
    where: { userId },
    attributes: ['projectId'],
  });
  const projectIds = memberships.map((item) => item.projectId);

  const where = projectIds.length > 0
    ? {
        [Op.or]: [
          { ownerId: userId },
          { id: { [Op.in]: projectIds } },
        ],
      }
    : { ownerId: userId };

  const { rows, count } = await Project.findAndCountAll({
    where,
    include: [ownerInclude],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
    distinct: true,
  });

  return {
    items: rows.map((project) => withRole(project, userId)),
    meta: buildMeta(page, limit, count),
  };
};

const updateProject = async (project, payload) => {
  const updates = {};

  if (payload.name !== undefined) {
    updates.name = payload.name.trim();
  }
  if (payload.description !== undefined) {
    updates.description = payload.description;
  }
  if (payload.startDate !== undefined) {
    updates.startDate = payload.startDate;
  }
  if (payload.endDate !== undefined) {
    updates.endDate = payload.endDate;
  }

  await project.update(updates);

  return getProjectDetail(project.id, project.ownerId);
};

const deleteProject = async (projectId) => {
  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new AppError(404, 'Không tìm thấy dự án');
  }

  const tasks = await Task.findAll({
    where: { projectId },
    attributes: ['id'],
  });
  const taskIds = tasks.map((task) => task.id);

  const attachments = taskIds.length > 0
    ? await Attachment.findAll({
        where: { taskId: { [Op.in]: taskIds } },
        attributes: ['fileName'],
      })
    : [];

  await project.destroy();

  attachments.forEach((attachment) => removeUploadedFile(attachment.fileName));

  return { id: projectId };
};

const listMembers = async (projectId) => {
  const memberships = await ProjectMember.findAll({
    where: { projectId },
    include: [
      {
        model: User,
        as: 'user',
        attributes: USER_PUBLIC_ATTRIBUTES,
      },
    ],
    order: [['createdAt', 'ASC']],
  });

  return memberships.map((membership) => ({
    id: membership.id,
    userId: membership.userId,
    user: membership.user,
    joinedAt: membership.createdAt,
  }));
};

const addMember = async (project, userId) => {
  const user = await User.findByPk(userId, {
    attributes: USER_PUBLIC_ATTRIBUTES,
  });

  if (!user) {
    throw new AppError(404, 'Không tìm thấy người dùng');
  }

  const existingMembership = await ProjectMember.findOne({
    where: { projectId: project.id, userId },
  });

  if (existingMembership) {
    throw new AppError(400, 'Người dùng đã là thành viên của dự án');
  }

  const membership = await ProjectMember.create({
    projectId: project.id,
    userId,
  });

  return {
    id: membership.id,
    userId,
    user,
    joinedAt: membership.createdAt,
  };
};

const removeMember = async (project, userId) => {
  if (project.ownerId === userId) {
    throw new AppError(400, 'Không thể gỡ chủ dự án khỏi dự án');
  }

  const membership = await ProjectMember.findOne({
    where: { projectId: project.id, userId },
  });

  if (!membership) {
    throw new AppError(404, 'Người dùng không phải thành viên của dự án');
  }

  const transaction = await sequelize.transaction();

  try {
    await Task.update(
      { assigneeId: null },
      {
        where: { projectId: project.id, assigneeId: userId },
        transaction,
      }
    );

    await membership.destroy({ transaction });
    await transaction.commit();

    return { userId };
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    throw error;
  }
};

module.exports = {
  createProject,
  listProjects,
  getProjectDetail,
  updateProject,
  deleteProject,
  listMembers,
  addMember,
  removeMember,
};
