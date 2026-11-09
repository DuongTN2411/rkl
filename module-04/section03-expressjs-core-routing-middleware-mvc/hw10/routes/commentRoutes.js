const express = require('express');
const commentController = require('../controllers/commentController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.get('/', commentController.getComments);
router.post('/', authenticate, commentController.createComment);

module.exports = router;
