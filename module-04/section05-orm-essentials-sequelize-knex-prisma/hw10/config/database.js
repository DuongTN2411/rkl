require('dotenv').config();
const { Sequelize } = require('sequelize');
const queryStore = require('../utils/queryStore');

const countQuery = () => {
  const store = queryStore.getStore();
  if (store) store.queryCount += 1;
};

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: countQuery,
  }
);

module.exports = sequelize;
