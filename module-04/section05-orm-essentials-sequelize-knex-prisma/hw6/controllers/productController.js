const { Op } = require('sequelize');
const Product = require('../models/product');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const SORT_OPTIONS = {
  price_asc: [['price', 'ASC'], ['id', 'DESC']],
  price_desc: [['price', 'DESC'], ['id', 'DESC']],
  id_desc: [['id', 'DESC']],
};

const toPositiveInt = (value, fallback) => {
  const number = Number.parseInt(value, 10);
  return Number.isInteger(number) && number > 0 ? number : fallback;
};

const escapeLike = (text) => text.replace(/[\\%_]/g, '\\$&');

exports.getAll = async (req, res, next) => {
  try {
    const page = toPositiveInt(req.query.page, DEFAULT_PAGE);
    const limit = Math.min(toPositiveInt(req.query.limit, DEFAULT_LIMIT), MAX_LIMIT);
    const offset = (page - 1) * limit;

    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword.trim() : '';
    const where = keyword ? { name: { [Op.like]: '%' + escapeLike(keyword) + '%' } } : {};

    const order = SORT_OPTIONS[req.query.sort] || SORT_OPTIONS.id_desc;

    const { count, rows } = await Product.findAndCountAll({ where, order, limit, offset });

    res.status(200).json({
      success: true,
      data: rows,
      meta: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};
