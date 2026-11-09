const sequelize = require('../config/database');
const Product = require('./product');
const Order = require('./order');
const OrderItem = require('./orderItem');

Order.belongsToMany(Product, {
  through: 'order_items',
  foreignKey: 'order_id',
  otherKey: 'product_id',
});
Product.belongsToMany(Order, {
  through: 'order_items',
  foreignKey: 'product_id',
  otherKey: 'order_id',
});

module.exports = { sequelize, Product, Order, OrderItem };
