const attachmentService = require('../services/attachmentService');
const { sendSuccess } = require('../utils/response');

const list = async (req, res, next) => {
  try {
    const attachments = await attachmentService.listAttachments(req.task.id);
    return sendSuccess(res, 200, 'Lấy danh sách tệp đính kèm thành công', attachments);
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const attachment = await attachmentService.createAttachment(
      req.task.id,
      req.user.id,
      req.file
    );
    return sendSuccess(res, 201, 'Tải tệp đính kèm thành công', attachment);
  } catch (error) {
    return next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await attachmentService.deleteAttachment(
      req.task.id,
      req.params.attachmentId,
      req.user.id,
      req.projectRole
    );
    return sendSuccess(res, 200, 'Xóa tệp đính kèm thành công', result);
  } catch (error) {
    return next(error);
  }
};

module.exports = { list, create, remove };
