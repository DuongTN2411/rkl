const { Attachment, User } = require('../models');
const { USER_PUBLIC_ATTRIBUTES } = require('../constants');
const AppError = require('../utils/AppError');
const { removeUploadedFile } = require('../utils/files');

const uploaderInclude = {
  model: User,
  as: 'uploader',
  attributes: USER_PUBLIC_ATTRIBUTES,
};

const toDto = (attachment) => {
  const data = attachment.toJSON ? attachment.toJSON() : attachment;

  return {
    id: data.id,
    taskId: data.taskId,
    originalName: data.originalName,
    mimeType: data.mimeType,
    size: data.size,
    url: `/api/v1/uploads/${data.fileName}`,
    uploadedBy: data.uploadedBy,
    uploader: data.uploader,
    createdAt: data.createdAt,
  };
};

const listAttachments = async (taskId) => {
  const attachments = await Attachment.findAll({
    where: { taskId },
    include: [uploaderInclude],
    order: [['createdAt', 'DESC']],
  });

  return attachments.map(toDto);
};

const createAttachment = async (taskId, userId, file) => {
  if (!file) {
    throw new AppError(400, 'Vui lòng chọn tệp cần tải lên qua field "file"');
  }

  try {
    const attachment = await Attachment.create({
      taskId,
      uploadedBy: userId,
      originalName: file.originalname.slice(0, 255),
      fileName: file.filename,
      mimeType: file.mimetype.slice(0, 100),
      size: file.size,
    });

    const saved = await Attachment.findByPk(attachment.id, {
      include: [uploaderInclude],
    });

    return toDto(saved);
  } catch (error) {
    removeUploadedFile(file.filename);
    throw error;
  }
};

const deleteAttachment = async (taskId, attachmentId, userId, projectRole) => {
  const id = Number(attachmentId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, 'Mã tệp đính kèm không hợp lệ');
  }

  const attachment = await Attachment.findOne({
    where: { id, taskId },
  });

  if (!attachment) {
    throw new AppError(404, 'Không tìm thấy tệp đính kèm');
  }

  if (projectRole !== 'owner' && attachment.uploadedBy !== userId) {
    throw new AppError(403, 'Bạn không có quyền xóa tệp đính kèm này');
  }

  const fileName = attachment.fileName;
  await attachment.destroy();
  removeUploadedFile(fileName);

  return { id };
};

module.exports = { listAttachments, createAttachment, deleteAttachment };
