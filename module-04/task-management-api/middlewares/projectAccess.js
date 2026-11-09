const { Project, ProjectMember } = require('../models');
const AppError = require('../utils/AppError');

const loadProject = async (req, res, next) => {
  try {
    const rawId = req.params.projectId || req.params.id;
    const projectId = Number(rawId);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      throw new AppError(400, 'Mã dự án không hợp lệ');
    }

    const project = await Project.findByPk(projectId);

    if (!project) {
      throw new AppError(404, 'Không tìm thấy dự án');
    }

    let role = project.ownerId === req.user.id ? 'owner' : null;

    if (!role) {
      const membership = await ProjectMember.findOne({
        where: { projectId: project.id, userId: req.user.id },
      });

      if (membership) {
        role = 'member';
      }
    }

    if (!role) {
      throw new AppError(403, 'Bạn không có quyền truy cập dự án này');
    }

    req.project = project;
    req.projectRole = role;
    return next();
  } catch (error) {
    return next(error);
  }
};

const requireProjectOwner = (req, res, next) => {
  if (req.projectRole !== 'owner') {
    return next(new AppError(403, 'Chỉ chủ dự án mới được thực hiện thao tác này'));
  }
  return next();
};

const requireTaskStatusPermission = (req, res, next) => {
  const isOwner = req.projectRole === 'owner';
  const isAssignee = req.task.assigneeId === req.user.id;

  if (!isOwner && !isAssignee) {
    return next(
      new AppError(403, 'Chỉ chủ dự án hoặc người được giao mới được cập nhật trạng thái công việc')
    );
  }

  return next();
};

module.exports = {
  loadProject,
  requireProjectOwner,
  requireTaskStatusPermission,
};
