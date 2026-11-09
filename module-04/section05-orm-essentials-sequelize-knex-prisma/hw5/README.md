# Homework 5 - Association One-to-Many va eager loading voi include

Dung lai `categories` va `products` (chay migration va seeder cua Practice 3 truoc).

## Cai dat va chay

```bash
npm install
cp .env.example .env
node server.js
```

`logging: console.log` duoc bat trong `config/database.js` de kiem chung so cau SELECT.

## Association

```js
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
```

## Endpoint

- `GET /api/v1/categories/:id`: tra ve category kem danh sach product thuoc category do.
- `GET /api/v1/products`: moi product kem object `category` chi gom `id` va `name` (`attributes: ['id', 'name']`).

## Kiem chung bang logging

Khi goi `GET /api/v1/products`, console chi in ra dung mot cau SELECT (co JOIN).

Cau SQL co JOIN do Sequelize sinh ra:

```sql
```

Anh log:

![log](images/products-log.png)
