const { Comment, User } = require('../models');
const { USER_PUBLIC_ATTRIBUTES } = require('../constants');
const AppError = require('../utils/AppError');

const authorInclude = {
  model: User,
  as: 'author',
  attributes: USER_PUBLIC_ATTRIBUTES,
};

const listComments = async (taskId) => {
  return Comment.findAll({
    where: { taskId },
    include: [authorInclude],
    order: [['createdAt', 'ASC']],
  });
};

const createComment = async (taskId, userId, content) => {
  const comment = await Comment.create({
    taskId,
    userId,
    content: content.trim(),
  });

  return Comment.findByPk(comment.id, {
    include: [authorInclude],
  });
};

const deleteComment = async (taskId, commentId, userId, projectRole) => {
  const id = Number(commentId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, 'Mã bình luận không hợp lệ');
  }

  const comment = await Comment.findOne({
    where: { id, taskId },
  });

  if (!comment) {
    throw new AppError(404, 'Không tìm thấy bình luận');
  }

  if (projectRole !== 'owner' && comment.userId !== userId) {
    throw new AppError(403, 'Bạn không có quyền xóa bình luận này');
  }

  await comment.destroy();

  return { id };
};

module.exports = { listComments, createComment, deleteComment };
