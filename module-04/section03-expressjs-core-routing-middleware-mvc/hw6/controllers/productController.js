const Product = require('../models/Product');

const getProducts = (req, res) => {
  const products = Product.getAll();
  res.json(products);
};

const createProduct = (req, res) => {
  const product = Product.create(req.body);
  res.status(201).json(product);
};

module.exports = { getProducts, createProduct };
