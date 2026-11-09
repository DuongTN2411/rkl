const { sequelize, Product, Order, OrderItem } = require('../models');
const HttpError = require('../utils/httpError');

const parseItems = (body) => {
  const items = body && body.items;

  if (!Array.isArray(items) || items.length === 0) {
    throw new HttpError(400, 'INVALID_ITEMS', 'items phai la mang khong rong');
  }

  const merged = new Map();
  for (const item of items) {
    const productId = Number(item && item.productId);
    const qty = Number(item && item.qty);

    if (!Number.isInteger(productId) || productId <= 0 || !Number.isInteger(qty) || qty <= 0) {
      throw new HttpError(400, 'INVALID_ITEMS', 'productId va qty phai la so nguyen duong');
    }

    merged.set(productId, (merged.get(productId) || 0) + qty);
  }

  return [...merged].map(([productId, qty]) => ({ productId, qty }));
};

exports.createOrder = async (req, res, next) => {
  try {
    const items = parseItems(req.body);

    const order = await sequelize.transaction(async (t) => {
      const products = await Product.findAll({
        where: { id: items.map((item) => item.productId) },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      const byId = new Map(products.map((product) => [product.id, product]));

      const missing = items.filter((item) => !byId.has(item.productId)).map((item) => item.productId);
      if (missing.length > 0) {
        throw new HttpError(404, 'PRODUCT_NOT_FOUND', 'Khong tim thay san pham co id: ' + missing.join(', '));
      }

      const outOfStock = items
        .filter((item) => byId.get(item.productId).stock < item.qty)
        .map((item) => byId.get(item.productId).name);
      if (outOfStock.length > 0) {
        throw new HttpError(409, 'OUT_OF_STOCK', 'Khong du ton kho: ' + outOfStock.join(', '), {
          products: outOfStock,
        });
      }

      const total = items.reduce((sum, item) => sum + byId.get(item.productId).price * item.qty, 0);

      const created = await Order.create({ total }, { transaction: t });

      await OrderItem.bulkCreate(
        items.map((item) => ({ order_id: created.id, product_id: item.productId, qty: item.qty })),
        { transaction: t }
      );

      for (const item of items) {
        await byId.get(item.productId).decrement('stock', { by: item.qty, transaction: t });
      }

      return created;
    });

    res.status(201).json({
      success: true,
      data: { orderId: order.id, total: order.total, items },
    });
  } catch (err) {
    next(err);
  }
};
