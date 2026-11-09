# Homework 7 - Upload file với Multer kèm validate

Route: `POST /upload/avatar`, nhận 1 file qua field `avatar`.

| Yêu cầu | Cách xử lý |
|---------|-----------|
| Chỉ nhận `image/jpeg`, `image/png`, `image/webp` | `fileFilter` trả lỗi, route đổi thành 400 |
| Tối đa 2MB | `limits: { fileSize: 2 * 1024 * 1024 }`, bắt `LIMIT_FILE_SIZE` thành 400 |
| Tên file không trùng | `Date.now()` + số ngẫu nhiên + tên gốc đã làm sạch ký tự đặc biệt |
| Lưu vào `uploads/` | `multer.diskStorage` |

## Chạy

```bash
npm install
npm start
```

## Test

| # | Trường hợp | Lệnh | Status | Kết quả mong đợi |
|---|-----------|------|--------|------------------|
| 1 | Ảnh PNG hợp lệ | `curl -F "avatar=@anh.png" http://localhost:3000/upload/avatar` | 200 | `{"message":"Upload thành công","filename":"<...>-anh.png","size":<byte>}` |
| 2 | File không phải ảnh | `curl -F "avatar=@ghichu.txt" http://localhost:3000/upload/avatar` | 400 | `{"message":"Chỉ chấp nhận file ảnh JPEG/PNG/WEBP"}` |
| 3 | Ảnh lớn hơn 2MB | `curl -F "avatar=@anh-lon.jpg" http://localhost:3000/upload/avatar` | 400 | `{"message":"File vượt quá dung lượng cho phép (2MB)"}` |
| 4 | Không gửi file | `curl -X POST http://localhost:3000/upload/avatar` | 400 | `{"message":"Vui lòng chọn file ảnh qua field \"avatar\""}` |

> Sau khi chạy thật, dán log/screenshot kết quả vào phần này.
