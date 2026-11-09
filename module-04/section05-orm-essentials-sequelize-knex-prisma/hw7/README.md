# Homework 7 - Query Builder voi Knex.js: migration va truy van thong ke

## Cai dat

```bash
mysql -u root -e "CREATE DATABASE bookstore"
npm install
cp .env.example .env
```

`knexfile.js` da duoc tao san (tuong duong `npx knex init`, doc thong tin tu `.env`).

## Chay

```bash
npx knex migrate:latest
npx knex seed:run
node report.js
npx knex migrate:rollback --all
```

- `users`: id, name VARCHAR(100), email VARCHAR(255) UNIQUE, timestamps
- `orders`: id, user_id (FK toi users.id), total INT, timestamps
- Seed: 5 user va 15 order.
- Ham `down` cua ca hai migration dung `dropTableIfExists`; `orders` bi xoa truoc `users` nen `migrate:rollback --all` chay khong loi.

## Cau SQL (in bang `.toString()` truoc khi thuc thi)

Dan ket qua `node report.js` vao day:

```sql
```

## Ket qua tra ve cua report.js

Dan lai bang ket qua that. Voi du lieu seed, ket qua mong doi nhu sau:

| name | order_count | total_spent |
| --- | --- | --- |
| Pham Thi Dung | 3 | 1200000 |
| Tran Thi Binh | 3 | 1040000 |
| Nguyen Van An | 4 | 1000000 |
