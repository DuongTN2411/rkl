const { Op } = require('sequelize');
const {
  ProjectMember,
  Task,
  Comment,
  Attachment,
  User,
} = require('../models');
const { USER_PUBLIC_ATTRIBUTES } = require('../constants');
const AppError = require('../utils/AppError');
const { getPagination, buildMeta } = require('../utils/pagination');
const { removeUploadedFile } = require('../utils/files');

const assigneeInclude = {
  model: User,
  as: 'assignee',
  attributes: USER_PUBLIC_ATTRIBUTES,
};

const detailIncludes = [
  assigneeInclude,
  {
    model: Comment,
    as: 'comments',
    separate: true,
    order: [['createdAt', 'ASC']],
    include: [
      {
        model: User,
        as: 'author',
        attributes: USER_PUBLIC_ATTRIBUTES,
      },
    ],
  },
  {
    model: Attachment,
    as: 'attachments',
    separate: true,
    order: [['createdAt', 'ASC']],
    include: [
      {
        model: User,
        as: 'uploader',
        attributes: USER_PUBLIC_ATTRIBUTES,
      },
    ],
  },
];

const ensureAssigneeIsMember = async (projectId, assigneeId) => {
  if (assigneeId === undefined || assigneeId === null) {
    return;
  }

  const membership = await ProjectMember.findOne({
    where: { projectId, userId: assigneeId },
    attributes: ['id'],
  });

  if (!membership) {
    throw new AppError(400, 'Người được giao phải là thành viên của dự án');
  }
};

const getTaskDetail = async (projectId, taskId) => {
  const task = await Task.findOne({
    where: { id: taskId, projectId },
    include: detailIncludes,
  });

  if (!task) {
    throw new AppError(404, 'Không tìm thấy công việc trong dự án');
  }

  return task;
};

const createTask = async (projectId, payload) => {
  await ensureAssigneeIsMember(projectId, payload.assigneeId);

  const task = await Task.create({
    projectId,
    title: payload.title.trim(),
    description: payload.description ?? null,
    status: payload.status ?? 'todo',
    priority: payload.priority ?? 'medium',
    dueDate: payload.dueDate ?? null,
    assigneeId: payload.assigneeId ?? null,
  });

  return getTaskDetail(projectId, task.id);
};

const listTasks = async (projectId, query) => {
  const { page, limit, offset } = getPagination(query, 10);
  const where = { projectId };

  if (query.status !== undefined) {
    where.status = query.status;
  }

  if (query.priority !== undefined) {
    where.priority = query.priority;
  }

  if (query.assigneeId !== undefined) {
    where.assigneeId = Number(query.assigneeId);
  }

  if (query.search !== undefined && query.search.trim() !== '') {
    where.title = { [Op.like]: `%${query.search.trim()}%` };
  }

  const sortBy = query.sortBy === 'dueDate' ? 'dueDate' : 'createdAt';
  const order = query.order === 'asc' ? 'ASC' : 'DESC';

  const { rows, count } = await Task.findAndCountAll({
    where,
    include: [assigneeInclude],
    order: [[sortBy, order]],
    limit,
    offset,
  });

  return {
    items: rows,
    meta: buildMeta(page, limit, count),
  };
};

const updateTask = async (task, payload) => {
  if (Object.prototype.hasOwnProperty.call(payload, 'assigneeId')) {
    await ensureAssigneeIsMember(task.projectId, payload.assigneeId);
  }

  const updates = {};

  if (payload.title !== undefined) {
    updates.title = payload.title.trim();
  }
  if (payload.description !== undefined) {
    updates.description = payload.description;
  }
  if (payload.status !== undefined) {
    updates.status = payload.status;
  }
  if (payload.priority !== undefined) {
    updates.priority = payload.priority;
  }
  if (payload.dueDate !== undefined) {
    updates.dueDate = payload.dueDate;
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'assigneeId')) {
    updates.assigneeId = payload.assigneeId;
  }

  await task.update(updates);

  return getTaskDetail(task.projectId, task.id);
};

const deleteTask = async (task) => {
  const attachments = await Attachment.findAll({
    where: { taskId: task.id },
    attributes: ['fileName'],
  });

  await task.destroy();

  attachments.forEach((attachment) => removeUploadedFile(attachment.fileName));

  return { id: task.id };
};

const updateTaskStatus = async (task, status) => {
  await task.update({ status });
  return getTaskDetail(task.projectId, task.id);
};

module.exports = {
  createTask,
  listTasks,
  getTaskDetail,
  updateTask,
  deleteTask,
  updateTaskStatus,
};
