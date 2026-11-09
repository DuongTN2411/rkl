const { Category, Product } = require('../models');

const toDto = (category, products) => ({
  id: category.id,
  name: category.name,
  products: products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
  })),
});

exports.slow = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ order: [['id', 'ASC']] });

    const data = [];
    for (const category of categories) {
      const products = await Product.findAll({
        where: { category_id: category.id },
        order: [['id', 'ASC']],
      });
      data.push(toDto(category, products));
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.fast = async (req, res, next) => {
  try {
    const separate = req.query.separate === 'true';

    const include = separate
      ? { model: Product, as: 'products', separate: true, order: [['id', 'ASC']] }
      : { model: Product, as: 'products' };

    const order = separate
      ? [['id', 'ASC']]
      : [['id', 'ASC'], [{ model: Product, as: 'products' }, 'id', 'ASC']];

    const categories = await Category.findAll({ include: [include], order });

    const data = categories.map((category) => toDto(category, category.products));

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
