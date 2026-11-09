# Homework 10 - Hệ thống Blog nhiều vai trò

Luồng: **Route → Controller → Model**, kèm middleware bảo vệ theo role.

```
hw10/
├── models/Post.js, Comment.js            # 2 mảng in-memory riêng, quan hệ 1-nhiều qua postId
├── controllers/postController.js, commentController.js
├── routes/postRoutes.js, commentRoutes.js   # express.Router(), mount /api/posts và /api/comments
├── middlewares/
│   ├── authenticate.js                   # thiếu Authorization -> 401; có -> req.user = { id: 1, role }
│   ├── authorize.js                      # authorize(role): sai role -> 403
│   └── upload.js                         # Multer field thumbnail (JPEG/PNG/WEBP, tối đa 2MB)
├── utils/AppError.js
└── app.js                                # error handler toàn cục duy nhất ở cuối
```

Role được đọc từ giá trị header: `Authorization: admin` -> role `admin`, giá trị khác -> role `user`.

## Bảng endpoint và middleware

| Method | Endpoint | Middleware áp dụng | Mô tả |
|--------|----------|--------------------|-------|
| GET | `/api/posts` | không | Danh sách bài viết |
| GET | `/api/posts/:id` | không | Chi tiết bài viết kèm comment, 404 nếu không có |
| POST | `/api/posts` | `authenticate` -> `uploadThumbnail` | Tạo bài viết (JSON hoặc multipart), ảnh tùy chọn lưu vào `thumbnailUrl` |
| DELETE | `/api/posts/:id` | `authenticate` -> `authorize('admin')` | Xóa bài viết và toàn bộ comment liên quan (mô phỏng ON DELETE CASCADE) |
| GET | `/api/comments?postId=` | không | Comment theo bài viết |
| POST | `/api/comments` | `authenticate` | Thêm comment, kiểm tra `postId` tồn tại, không có -> 404 |

Mọi lỗi (400, 401, 403, 404, 500) đi qua `AppError` và middleware lỗi toàn cục, trả `{ "success": false, "message": ... }`.

## Chạy

```bash
npm install
npm start
```

## Kịch bản test

| # | Kịch bản | Lệnh | Status mong đợi |
|---|----------|------|-----------------|
| 1 | Xóa bài khi chưa đăng nhập | `curl -X DELETE http://localhost:3000/api/posts/1` | 401 `Chưa đăng nhập` |
| 2 | Xóa bài bằng role user | `curl -X DELETE http://localhost:3000/api/posts/1 -H "Authorization: user"` | 403 `Không đủ quyền truy cập` |
| 3 | Xóa bài bằng role admin | `curl -X DELETE http://localhost:3000/api/posts/1 -H "Authorization: admin"` | 200, thông báo đã xóa bài viết và 2 comment |
| 4 | Comment của bài vừa xóa đã mất (cascade) | `curl "http://localhost:3000/api/comments?postId=1"` | 200, `data: []` |
| 5 | Comment vào bài không tồn tại | `curl -X POST http://localhost:3000/api/comments -H "Authorization: user" -H "Content-Type: application/json" -d '{"postId":999,"content":"hi"}'` | 404 `Không tìm thấy bài viết` |
| 6 | Comment hợp lệ | `curl -X POST http://localhost:3000/api/comments -H "Authorization: user" -H "Content-Type: application/json" -d '{"postId":2,"content":"Bài rất hữu ích"}'` | 201 |
| 7 | Tạo bài kèm thumbnail hợp lệ | `curl -X POST http://localhost:3000/api/posts -H "Authorization: admin" -F "title=Bài mới" -F "content=Nội dung" -F "thumbnail=@anh.png"` | 201, có `thumbnailUrl` |
| 8 | Tạo bài với file không phải ảnh | `curl -X POST http://localhost:3000/api/posts -H "Authorization: admin" -F "title=A" -F "content=B" -F "thumbnail=@ghichu.txt"` | 400 `Chỉ chấp nhận file ảnh JPEG/PNG/WEBP` |

> Sau khi chạy thật, dán log/screenshot kết quả vào phần này.
