const { Category, Product } = require('../models');

exports.getOne = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Id khong hop le' },
      });
    }

    const category = await Category.findByPk(id, {
      include: [{ model: Product, as: 'products' }],
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Khong tim thay category' },
      });
    }

    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};
