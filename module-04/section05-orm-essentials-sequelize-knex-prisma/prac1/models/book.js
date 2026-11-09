const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define(
  'Book',
  {
    title: { type: DataTypes.STRING(200), allowNull: false },
    author: { type: DataTypes.STRING(100), allowNull: false },
    price: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: 'books',
    underscored: true,
  }
);

module.exports = Book;
