const { Task } = require('../models');
const AppError = require('../utils/AppError');

const loadTask = async (req, res, next) => {
  try {
    const taskId = Number(req.params.taskId);

    if (!Number.isInteger(taskId) || taskId <= 0) {
      throw new AppError(400, 'Mã công việc không hợp lệ');
    }

    const task = await Task.findOne({
      where: { id: taskId, projectId: req.project.id },
    });

    if (!task) {
      throw new AppError(404, 'Không tìm thấy công việc trong dự án');
    }

    req.task = task;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = loadTask;
