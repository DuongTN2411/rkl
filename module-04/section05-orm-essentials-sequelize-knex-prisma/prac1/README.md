# Practice 1 - Ket noi MySQL va dinh nghia Model Book

## Cai dat

```bash
mysql -u root -e "CREATE DATABASE bookstore"
npm install
cp .env.example .env
```

Dien gia tri that vao `.env` (file nay khong duoc commit):

```
DB_HOST=localhost
DB_NAME=bookstore
DB_USER=root
DB_PASS=
```

## Chay

```bash
node index.js
```

## Ket qua

Log ket noi thanh cong:

![log ket noi](images/connect-log.png)

Bang `books` trong MySQL:

![bang books](images/books-table.png)
