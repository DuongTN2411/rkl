# Practice 4 - REST API CRUD voi Sequelize va Express

Dung lai bang `products` cua Practice 3 (chay `db:migrate` va `db:seed:all` truoc).

## Cai dat va chay

```bash
npm install
cp .env.example .env
node server.js
```

## Endpoint

| Method | URL | Status |
| --- | --- | --- |
| GET | /api/v1/products | 200 |
| GET | /api/v1/products/:id | 200, 404 |
| POST | /api/v1/products | 201 |
| PUT | /api/v1/products/:id | 200, 404 |
| DELETE | /api/v1/products/:id | 204, 404 |

Format response:

```json
{ "success": true, "data": "..." }
{ "success": false, "error": { "code": "...", "message": "..." } }
```

Response loi khong tra ve cau SQL, ten bang hay chuoi ket noi database. Loi khong xac dinh duoc ghi ra console cua server va chi tra ve `INTERNAL_ERROR`.

## Ket qua test Postman

| Endpoint | Anh |
| --- | --- |
| GET /api/v1/products | ![](images/get-all.png) |
| GET /api/v1/products/:id | ![](images/get-one.png) |
| POST /api/v1/products | ![](images/post.png) |
| PUT /api/v1/products/:id | ![](images/put.png) |
| DELETE /api/v1/products/:id | ![](images/delete.png) |
