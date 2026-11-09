const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProjectMember = sequelize.define(
  'ProjectMember',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'project_members',
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['project_id', 'user_id'],
      },
    ],
  }
);

module.exports = ProjectMember;
