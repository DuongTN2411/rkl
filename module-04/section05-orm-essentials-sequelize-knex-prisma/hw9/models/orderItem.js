const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define(
  'order_items',
  {
    qty: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: 'order_items',
    underscored: true,
  }
);

module.exports = OrderItem;
