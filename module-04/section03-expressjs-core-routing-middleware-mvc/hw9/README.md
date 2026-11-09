# Homework 9 - API Nhân viên hoàn chỉnh (MVC + Upload + Error Handling)

Luồng: **Client → Route → Controller → Model**

```
hw9/
├── models/Employee.js              # getAll, create, findById, updateAvatar
├── controllers/employeeController.js
├── routes/employeeRoutes.js
├── middlewares/
│   ├── upload.js                   # cấu hình Multer riêng (image/*, tối đa 2MB)
│   └── logger.js                   # log mọi request
├── utils/AppError.js
└── app.js                          # logger toàn cục, routes, 404, error handler cuối cùng
```

Mọi controller dùng `try/catch` rồi `next(err)`. Error handler cuối `app.js` trả `{ "success": false, "message": ... }`.

## Endpoint

| Method | Endpoint | Yêu cầu |
|--------|----------|---------|
| GET | `/api/employees` | Trả toàn bộ nhân viên `{ id, name, email, avatarUrl }` |
| POST | `/api/employees` | Bắt buộc `name`, `email` (thiếu → 400); email trùng → 409 `{ "message": "Email đã tồn tại" }` |
| GET | `/api/employees/:id` | 404 qua `AppError` nếu không thấy |
| POST | `/api/employees/:id/avatar` | Multer field `avatar`, chỉ `image/*`, tối đa 2MB, cập nhật `avatarUrl` |

## Chạy

```bash
npm install
npm start
```

## Test

| # | Tình huống | Lệnh | Status | Kết quả mong đợi |
|---|-----------|------|--------|------------------|
| 1 | Lấy danh sách | `curl http://localhost:3000/api/employees` | 200 | mảng 2 nhân viên mẫu |
| 2 | Thêm hợp lệ | `curl -X POST http://localhost:3000/api/employees -H "Content-Type: application/json" -d '{"name":"Lê C","email":"c@company.com"}'` | 201 | nhân viên mới `id: 3` |
| 3 | Thiếu email | `curl -X POST http://localhost:3000/api/employees -H "Content-Type: application/json" -d '{"name":"D"}'` | 400 | `{"success":false,"message":"Thiếu trường bắt buộc: name và email"}` |
| 4 | Email trùng | `curl -X POST http://localhost:3000/api/employees -H "Content-Type: application/json" -d '{"name":"X","email":"a@company.com"}'` | 409 | `{"success":false,"message":"Email đã tồn tại"}` |
| 5 | Id không tồn tại | `curl http://localhost:3000/api/employees/999` | 404 | `{"success":false,"message":"Không tìm thấy nhân viên"}` |
| 6 | Upload ảnh hợp lệ | `curl -F "avatar=@anh.png" http://localhost:3000/api/employees/1/avatar` | 200 | `avatarUrl` dạng `/uploads/<tên file>` |
| 7 | Upload file không phải ảnh | `curl -F "avatar=@ghichu.txt" http://localhost:3000/api/employees/1/avatar` | 400 | `{"success":false,"message":"Chỉ chấp nhận file ảnh (image/*)"}` |
| 8 | Upload ảnh trên 2MB | `curl -F "avatar=@anh-lon.jpg" http://localhost:3000/api/employees/1/avatar` | 400 | `{"success":false,"message":"File vượt quá dung lượng cho phép (2MB)"}` |

> Sau khi chạy thật, dán log/screenshot kết quả vào phần này.
