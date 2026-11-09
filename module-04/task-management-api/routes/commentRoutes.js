const express = require('express');
const commentController = require('../controllers/commentController');
const authenticate = require('../middlewares/authenticate');
const loadTask = require('../middlewares/loadTask');
const { loadProject } = require('../middlewares/projectAccess');
const { validateCommentCreate } = require('../middlewares/validate');

const router = express.Router({ mergeParams: true });

router.use(authenticate);
router.use(loadProject);
router.use(loadTask);

router
  .route('/')
  .get(commentController.list)
  .post(validateCommentCreate, commentController.create);

router.delete('/:commentId', commentController.remove);

module.exports = router;
