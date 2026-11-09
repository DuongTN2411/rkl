# Practice 3 - Migration va Seeder voi sequelize-cli

## Cai dat

```bash
mysql -u root -e "CREATE DATABASE bookstore"
npm install
cp .env.example .env
```

Khung thu muc do `npx sequelize-cli init` sinh ra da duoc tao san (`config/`, `migrations/`, `models/`, `seeders/`, `.sequelizerc`).

## Cau truc bang

- `categories`: id, name STRING(100) NOT NULL, created_at, updated_at
- `products`: id, name, price INTEGER, category_id (khoa ngoai toi categories.id), created_at, updated_at

Ham `down` cua hai migration deu dung `dropTable`. Khi `db:migrate:undo:all`, sequelize-cli chay nguoc thu tu nen `products` bi xoa truoc `categories`.

## Ket qua ba lenh

### 1. `npx sequelize-cli db:migrate`

```
```

### 2. `npx sequelize-cli db:seed:all`

```
```

### 3. `npx sequelize-cli db:migrate:undo`

```
```

## Bang SequelizeMeta

![SequelizeMeta](images/sequelizemeta.png)
