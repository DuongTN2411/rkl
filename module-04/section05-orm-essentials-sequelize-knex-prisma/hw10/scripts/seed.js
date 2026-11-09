const { Category, Product } = require('../models');
const sequelize = require('../config/database');

async function main() {
  try {
    await sequelize.sync({ force: true });

    await Category.bulkCreate(
      Array.from({ length: 50 }, (_, i) => ({ name: 'Category ' + (i + 1) }))
    );

    const categories = await Category.findAll({ order: [['id', 'ASC']] });
    const products = [];
    for (const category of categories) {
      for (let n = 1; n <= 10; n++) {
        products.push({
          name: category.name + ' - Product ' + n,
          price: n * 10000,
          category_id: category.id,
        });
      }
    }
    await Product.bulkCreate(products);

    console.log('Da nap ' + categories.length + ' category va ' + products.length + ' product.');
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

main();
