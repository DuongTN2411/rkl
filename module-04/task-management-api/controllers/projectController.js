const projectService = require('../services/projectService');
const { sendSuccess } = require('../utils/response');

const list = async (req, res, next) => {
  try {
    const result = await projectService.listProjects(req.user.id, req.query);
    return sendSuccess(res, 200, 'Lấy danh sách dự án thành công', result.items, result.meta);
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.user.id, req.body);
    return sendSuccess(res, 201, 'Tạo dự án thành công', project);
  } catch (error) {
    return next(error);
  }
};

const detail = async (req, res, next) => {
  try {
    const project = await projectService.getProjectDetail(req.project.id, req.user.id);
    return sendSuccess(res, 200, 'Lấy chi tiết dự án thành công', project);
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(req.project, req.body);
    return sendSuccess(res, 200, 'Cập nhật dự án thành công', project);
  } catch (error) {
    return next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await projectService.deleteProject(req.project.id);
    return sendSuccess(res, 200, 'Xóa dự án thành công', result);
  } catch (error) {
    return next(error);
  }
};

const listMembers = async (req, res, next) => {
  try {
    const members = await projectService.listMembers(req.project.id);
    return sendSuccess(res, 200, 'Lấy danh sách thành viên thành công', members);
  } catch (error) {
    return next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const member = await projectService.addMember(req.project, req.body.userId);
    return sendSuccess(res, 201, 'Thêm thành viên vào dự án thành công', member);
  } catch (error) {
    return next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const result = await projectService.removeMember(
      req.project,
      Number(req.params.userId)
    );
    return sendSuccess(res, 200, 'Gỡ thành viên khỏi dự án thành công', result);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  list,
  create,
  detail,
  update,
  remove,
  listMembers,
  addMember,
  removeMember,
};
