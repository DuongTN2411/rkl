const { sequelize, Product, Order, OrderItem } = require('../models');

async function main() {
  try {
    const products = await Product.findAll({ attributes: ['id', 'name', 'stock'], order: [['id', 'ASC']], raw: true });
    const orders = await Order.findAll({ attributes: ['id', 'total'], order: [['id', 'ASC']], raw: true });
    const items = await OrderItem.findAll({ attributes: ['order_id', 'product_id', 'qty'], raw: true });

    console.log('products (stock):');
    console.table(products);
    console.log('orders:');
    console.table(orders);
    console.log('order_items:');
    console.table(items);
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

main();
