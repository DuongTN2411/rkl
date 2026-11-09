# Homework 8 - Prisma: schema, migrate, generate va CRUD voi Prisma Client

## Cai dat

```bash
mysql -u root -e "CREATE DATABASE bookstore"
npm install
cp .env.example .env
```

Dien `DATABASE_URL` vao `.env`, vi du:

```
DATABASE_URL="mysql://root:@localhost:3306/bookstore"
```

Du an dung Prisma 6 (`prisma init --datasource-provider mysql` da duoc thay bang file `prisma/schema.prisma` san co).

## Chay

```bash
npx prisma migrate dev --name init
npx prisma generate
node main.js
npx prisma studio
```

## Yeu cau bat buoc

- Author va hai Book duoc tao trong mot loi goi `prisma.author.create()` duy nhat (nested write `books: { create: [...] }`).
- Xoa mot id khong ton tai: bat loi `P2025`, in thong bao thay vi de chuong trinh dung bat thuong.

## Ket qua

Anh du lieu trong Prisma Studio:

![prisma studio](images/prisma-studio.png)
