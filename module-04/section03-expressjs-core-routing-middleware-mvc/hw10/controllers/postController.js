const fs = require('fs');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const AppError = require('../utils/AppError');

const removeUploadedFile = (file) => {
  if (file) fs.unlink(file.path, () => {});
};

const getPosts = (req, res, next) => {
  try {
    res.json({ success: true, data: Post.getAll() });
  } catch (err) {
    next(err);
  }
};

const getPostById = (req, res, next) => {
  try {
    const post = Post.findById(req.params.id);

    if (!post) {
      throw new AppError('Không tìm thấy bài viết', 404);
    }

    const comments = Comment.findByPostId(post.id);
    res.json({ success: true, data: { ...post, comments } });
  } catch (err) {
    next(err);
  }
};

const createPost = (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      removeUploadedFile(req.file);
      throw new AppError('Thiếu trường bắt buộc: title và content', 400);
    }

    const thumbnailUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const post = Post.create({ title, content, thumbnailUrl });
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

const deletePost = (req, res, next) => {
  try {
    const post = Post.deleteById(req.params.id);

    if (!post) {
      throw new AppError('Không tìm thấy bài viết', 404);
    }

    const deletedComments = Comment.deleteByPostId(post.id);
    res.json({
      success: true,
      message: `Đã xóa bài viết ${post.id} và ${deletedComments} comment liên quan`
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPosts, getPostById, createPost, deletePost };
