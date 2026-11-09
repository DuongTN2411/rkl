const sequelize = require('../config/database');
const Product = require('../models/product');

async function main() {
  try {
    await Product.sync();
    await Product.destroy({ where: {} });

    const rows = [];
    for (let i = 1; i <= 46; i++) {
      const isBook = i % 2 === 1;
      rows.push({
        name: (isBook ? 'Sach so ' : 'Do dung so ') + i,
        price: i * 10000,
      });
    }

    await Product.bulkCreate(rows);
    console.log('Da nap ' + rows.length + ' san pham (23 san pham co tu "Sach").');
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

main();
