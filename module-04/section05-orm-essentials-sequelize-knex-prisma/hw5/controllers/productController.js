const { Category, Product } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      order: [['id', 'ASC']],
    });

    res.status(200).json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};
