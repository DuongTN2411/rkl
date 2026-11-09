const { sequelize, Product } = require('../models');

async function main() {
  try {
    await sequelize.sync({ force: true });

    await Product.bulkCreate([
      { id: 1, name: 'Sach Node.js', price: 120000, stock: 10 },
      { id: 2, name: 'Sach MySQL', price: 95000, stock: 10 },
      { id: 3, name: 'But bi', price: 5000, stock: 100 },
      { id: 4, name: 'So tay', price: 30000, stock: 50 },
      { id: 5, name: 'Chuot khong day', price: 250000, stock: 1 },
    ]);

    console.log('Da tao lai cac bang orders, order_items, products va nap 5 san pham.');
    console.log('San pham id=5 chi con ton kho 1 de test kich ban thieu hang.');
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

main();
