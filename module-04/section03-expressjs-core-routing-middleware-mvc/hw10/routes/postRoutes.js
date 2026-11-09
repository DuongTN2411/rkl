const express = require('express');
const postController = require('../controllers/postController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { uploadThumbnail } = require('../middlewares/upload');

const router = express.Router();

router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);
router.post('/', authenticate, uploadThumbnail, postController.createPost);
router.delete('/:id', authenticate, authorize('admin'), postController.deletePost);

module.exports = router;
