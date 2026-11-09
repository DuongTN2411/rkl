const commentService = require('../services/commentService');
const { sendSuccess } = require('../utils/response');

const list = async (req, res, next) => {
  try {
    const comments = await commentService.listComments(req.task.id);
    return sendSuccess(res, 200, 'Lấy danh sách bình luận thành công', comments);
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const comment = await commentService.createComment(
      req.task.id,
      req.user.id,
      req.body.content
    );
    return sendSuccess(res, 201, 'Tạo bình luận thành công', comment);
  } catch (error) {
    return next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await commentService.deleteComment(
      req.task.id,
      req.params.commentId,
      req.user.id,
      req.projectRole
    );
    return sendSuccess(res, 200, 'Xóa bình luận thành công', result);
  } catch (error) {
    return next(error);
  }
};

module.exports = { list, create, remove };
