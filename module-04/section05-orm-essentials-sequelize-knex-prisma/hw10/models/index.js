const Category = require('./category');
const Product = require('./product');

Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

module.exports = { Category, Product };
