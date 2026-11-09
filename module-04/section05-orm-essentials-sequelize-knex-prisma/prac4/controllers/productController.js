const Product = require('../models/product');

const sendData = (res, status, data) => res.status(status).json({ success: true, data });

const sendError = (res, status, code, message) =>
  res.status(status).json({ success: false, error: { code, message } });

const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const pickFields = (body) => {
  const data = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.price !== undefined) data.price = body.price;
  if (body.categoryId !== undefined) data.categoryId = body.categoryId;
  return data;
};

exports.getAll = async (req, res, next) => {
  try {
    const products = await Product.findAll({ order: [['id', 'DESC']] });
    sendData(res, 200, products);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return sendError(res, 400, 'INVALID_ID', 'Id khong hop le');

    const product = await Product.findByPk(id);
    if (!product) return sendError(res, 404, 'NOT_FOUND', 'Khong tim thay san pham');

    sendData(res, 200, product);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const product = await Product.create(pickFields(req.body || {}));
    sendData(res, 201, product);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return sendError(res, 400, 'INVALID_ID', 'Id khong hop le');

    const product = await Product.findByPk(id);
    if (!product) return sendError(res, 404, 'NOT_FOUND', 'Khong tim thay san pham');

    await product.update(pickFields(req.body || {}));
    sendData(res, 200, product);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return sendError(res, 400, 'INVALID_ID', 'Id khong hop le');

    const product = await Product.findByPk(id);
    if (!product) return sendError(res, 404, 'NOT_FOUND', 'Khong tim thay san pham');

    await product.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
