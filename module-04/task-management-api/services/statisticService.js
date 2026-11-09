const { Op, fn, col } = require('sequelize');
const { Task } = require('../models');

const getProjectStatistics = async (projectId) => {
  const today = new Date().toISOString().slice(0, 10);

  const [totalTasks, groupedByStatus, overdueTasks] = await Promise.all([
    Task.count({ where: { projectId } }),
    Task.findAll({
      attributes: ['status', [fn('COUNT', col('id')), 'count']],
      where: { projectId },
      group: ['status'],
      raw: true,
    }),
    Task.count({
      where: {
        projectId,
        status: { [Op.ne]: 'done' },
        dueDate: { [Op.lt]: today },
      },
    }),
  ]);

  const byStatus = { todo: 0, doing: 0, done: 0 };

  groupedByStatus.forEach((item) => {
    byStatus[item.status] = Number(item.count);
  });

  return {
    totalTasks,
    byStatus,
    overdueTasks,
  };
};

const getPersonalStatistics = async (userId) => {
  const [assignedTasks, completedTasks] = await Promise.all([
    Task.count({ where: { assigneeId: userId } }),
    Task.count({ where: { assigneeId: userId, status: 'done' } }),
  ]);

  return {
    assignedTasks,
    completedTasks,
  };
};

module.exports = { getProjectStatistics, getPersonalStatistics };
