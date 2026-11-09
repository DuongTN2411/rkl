const Post = require('../models/Post');
const Comment = require('../models/Comment');
const AppError = require('../utils/AppError');

const getComments = (req, res, next) => {
  try {
    const { postId } = req.query;

    if (!postId) {
      throw new AppError('Thiếu query postId', 400);
    }

    res.json({ success: true, data: Comment.findByPostId(postId) });
  } catch (err) {
    next(err);
  }
};

const createComment = (req, res, next) => {
  try {
    const { postId, content } = req.body;

    if (!postId || !content) {
      throw new AppError('Thiếu trường bắt buộc: postId và content', 400);
    }

    if (!Post.findById(postId)) {
      throw new AppError('Không tìm thấy bài viết', 404);
    }

    const comment = Comment.create({ postId, content, authorId: req.user.id });
    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

module.exports = { getComments, createComment };
