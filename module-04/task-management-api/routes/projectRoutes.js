const express = require('express');
const projectController = require('../controllers/projectController');
const statisticController = require('../controllers/statisticController');
const authenticate = require('../middlewares/authenticate');
const {
  loadProject,
  requireProjectOwner,
} = require('../middlewares/projectAccess');
const {
  validateProjectCreate,
  validateProjectUpdate,
  validatePagination,
  validateMemberCreate,
  validateMemberParams,
} = require('../middlewares/validate');

const router = express.Router();

router.use(authenticate);

router
  .route('/')
  .get(validatePagination, projectController.list)
  .post(validateProjectCreate, projectController.create);

router.get(
  '/:id/statistics',
  loadProject,
  statisticController.project
);

router.get(
  '/:id/members',
  loadProject,
  projectController.listMembers
);

router.post(
  '/:id/members',
  loadProject,
  requireProjectOwner,
  validateMemberCreate,
  projectController.addMember
);

router.delete(
  '/:id/members/:userId',
  loadProject,
  requireProjectOwner,
  validateMemberParams,
  projectController.removeMember
);

router.get('/:id', loadProject, projectController.detail);

router.put(
  '/:id',
  loadProject,
  requireProjectOwner,
  validateProjectUpdate,
  projectController.update
);

router.delete(
  '/:id',
  loadProject,
  requireProjectOwner,
  projectController.remove
);

module.exports = router;
