const taskService = require('../services/taskService');
const { sendSuccess } = require('../utils/response');

const list = async (req, res, next) => {
  try {
    const result = await taskService.listTasks(req.project.id, req.query);
    return sendSuccess(res, 200, 'Lấy danh sách công việc thành công', result.items, result.meta);
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.project.id, req.body);
    return sendSuccess(res, 201, 'Tạo công việc thành công', task);
  } catch (error) {
    return next(error);
  }
};

const detail = async (req, res, next) => {
  try {
    const task = await taskService.getTaskDetail(req.project.id, req.task.id);
    return sendSuccess(res, 200, 'Lấy chi tiết công việc thành công', task);
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.task, req.body);
    return sendSuccess(res, 200, 'Cập nhật công việc thành công', task);
  } catch (error) {
    return next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await taskService.deleteTask(req.task);
    return sendSuccess(res, 200, 'Xóa công việc thành công', result);
  } catch (error) {
    return next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const task = await taskService.updateTaskStatus(req.task, req.body.status);
    return sendSuccess(res, 200, 'Cập nhật trạng thái công việc thành công', task);
  } catch (error) {
    return next(error);
  }
};

module.exports = { list, create, detail, update, remove, updateStatus };
