const express = require('express');
const authRoutes = require('./authRoutes');
const projectRoutes = require('./projectRoutes');
const taskRoutes = require('./taskRoutes');
const commentRoutes = require('./commentRoutes');
const attachmentRoutes = require('./attachmentRoutes');
const statisticRoutes = require('./statisticRoutes');
const { sendSuccess } = require('../utils/response');

const router = express.Router();

router.get('/health', (req, res) => {
  sendSuccess(res, 200, 'API đang hoạt động', { status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/statistics', statisticRoutes);

router.use('/projects/:projectId/tasks/:taskId/comments', commentRoutes);
router.use('/projects/:projectId/tasks/:taskId/attachments', attachmentRoutes);
router.use('/projects/:projectId/tasks', taskRoutes);
router.use('/projects', projectRoutes);

module.exports = router;
