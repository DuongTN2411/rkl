const express = require('express');
const attachmentController = require('../controllers/attachmentController');
const authenticate = require('../middlewares/authenticate');
const loadTask = require('../middlewares/loadTask');
const { loadProject } = require('../middlewares/projectAccess');
const { uploadAttachment } = require('../middlewares/upload');

const router = express.Router({ mergeParams: true });

router.use(authenticate);
router.use(loadProject);
router.use(loadTask);

router
  .route('/')
  .get(attachmentController.list)
  .post(uploadAttachment, attachmentController.create);

router.delete('/:attachmentId', attachmentController.remove);

module.exports = router;
