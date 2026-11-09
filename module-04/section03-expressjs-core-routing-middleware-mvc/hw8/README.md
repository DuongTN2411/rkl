# Homework 8 - Global Error Handling với Custom Error Class

```
hw8/
├── utils/AppError.js   # class AppError extends Error (message, statusCode), isOperational = true
└── app.js              # routes User + middleware lỗi toàn cục đặt cuối cùng
```

- Mỗi route chủ động gọi `next(new AppError(...))` đúng tình huống.
- Middleware lỗi toàn cục có đúng 4 tham số `(err, req, res, next)`, trả `{ "success": false, "message": "<err.message>" }`, status lấy từ `err.statusCode`, mặc định 500.
- `GET /users/secret` được khai báo **trước** `GET /users/:id` để không bị `:id` bắt nhầm.

## Chạy

```bash
npm install
npm start
```

## Test

| # | Tình huống | Lệnh | Status | Kết quả mong đợi |
|---|-----------|------|--------|------------------|
| 1 | User không tồn tại | `curl http://localhost:3000/users/999` | 404 | `{"success":false,"message":"Không tìm thấy user"}` |
| 2 | Thiếu email | `curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"name":"C"}'` | 400 | `{"success":false,"message":"Thiếu trường email"}` |
| 3 | Thiếu Authorization | `curl http://localhost:3000/users/secret` | 401 | `{"success":false,"message":"Chưa xác thực"}` |
| 4 | Chạy đúng | `curl http://localhost:3000/users/1` | 200 | `{"success":true,"data":{"id":1,...}}` |
| 5 | Có Authorization | `curl http://localhost:3000/users/secret -H "Authorization: abc"` | 200 | `{"success":true,"message":"Dữ liệu bí mật"}` |

> Sau khi chạy thật, dán log/screenshot kết quả vào phần này.
