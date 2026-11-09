const express = require('express');
const taskController = require('../controllers/taskController');
const authenticate = require('../middlewares/authenticate');
const loadTask = require('../middlewares/loadTask');
const {
  loadProject,
  requireProjectOwner,
  requireTaskStatusPermission,
} = require('../middlewares/projectAccess');
const {
  validateTaskCreate,
  validateTaskUpdate,
  validateTaskQuery,
  validateTaskStatus,
} = require('../middlewares/validate');

const router = express.Router({ mergeParams: true });

router.use(authenticate);
router.use(loadProject);

router
  .route('/')
  .get(validateTaskQuery, taskController.list)
  .post(requireProjectOwner, validateTaskCreate, taskController.create);

router.patch(
  '/:taskId/status',
  loadTask,
  validateTaskStatus,
  requireTaskStatusPermission,
  taskController.updateStatus
);

router.get('/:taskId', loadTask, taskController.detail);

router.put(
  '/:taskId',
  loadTask,
  requireProjectOwner,
  validateTaskUpdate,
  taskController.update
);

router.delete(
  '/:taskId',
  loadTask,
  requireProjectOwner,
  taskController.remove
);

module.exports = router;
