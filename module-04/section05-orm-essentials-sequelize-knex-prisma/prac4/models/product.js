const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define(
  'Product',
  {
    name: { type: DataTypes.STRING(200), allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    categoryId: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: 'products',
    underscored: true,
  }
);

module.exports = Product;
