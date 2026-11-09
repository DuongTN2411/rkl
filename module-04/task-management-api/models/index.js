const sequelize = require('../config/database');
const User = require('./user');
const Project = require('./project');
const ProjectMember = require('./projectMember');
const Task = require('./task');
const Comment = require('./comment');
const Attachment = require('./attachment');

User.hasMany(Project, { foreignKey: 'ownerId', as: 'ownedProjects' });
Project.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

Project.belongsToMany(User, {
  through: ProjectMember,
  foreignKey: 'projectId',
  otherKey: 'userId',
  as: 'members',
});
User.belongsToMany(Project, {
  through: ProjectMember,
  foreignKey: 'userId',
  otherKey: 'projectId',
  as: 'projects',
});

Project.hasMany(ProjectMember, { foreignKey: 'projectId', as: 'memberships' });
ProjectMember.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
ProjectMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(ProjectMember, { foreignKey: 'userId', as: 'memberships' });

Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Task.belongsTo(User, { foreignKey: 'assigneeId', as: 'assignee' });
User.hasMany(Task, { foreignKey: 'assigneeId', as: 'assignedTasks' });

Task.hasMany(Comment, { foreignKey: 'taskId', as: 'comments' });
Comment.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });

Task.hasMany(Attachment, { foreignKey: 'taskId', as: 'attachments' });
Attachment.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });
Attachment.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });
User.hasMany(Attachment, { foreignKey: 'uploadedBy', as: 'attachments' });

module.exports = {
  sequelize,
  User,
  Project,
  ProjectMember,
  Task,
  Comment,
  Attachment,
};
