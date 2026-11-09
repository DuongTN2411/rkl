# Task Management API

Backend RESTful API cho hệ thống **Quản lý công việc nhóm**, xây dựng theo kiến thức đã học ở module 01 - 04:

- Node.js, Express.js theo mô hình MVC (routes - controllers - services - models - middlewares).
- MySQL + Sequelize ORM, quản lý bảng bằng migration và dữ liệu mẫu bằng seeder.
- Xác thực bằng JWT, mã hóa mật khẩu bằng bcrypt.
- Multer cho chức năng tệp đính kèm.
- Toàn bộ API đặt dưới tiền tố `/api/v1`.
- Kiểm thử bằng Postman.

## 1. Yêu cầu môi trường

- Node.js 18 trở lên.
- MySQL 8.x (một số bản MySQL cũ hơn vẫn có thể chạy nhưng không được hỗ trợ chính thức).
- npm.

## 2. Cài đặt

### Bước 1: Tạo database

```bash
mysql -u root -p -e "CREATE DATABASE task_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Bước 2: Cài dependencies

```bash
npm install
```

### Bước 3: Cấu hình biến môi trường

```bash
cp .env.example .env
```

Mở file `.env` và điền thông tin database, JWT secret:

```dotenv
PORT=3000
NODE_ENV=development

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=task_management
DB_USER=root
DB_PASS=

JWT_SECRET=thay_bang_mot_chuoi_bi_mat_that_dai
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=10
```

Lưu ý: file `.env` đã nằm trong `.gitignore`, không đưa lên repository.

### Bước 4: Chạy migration và seeder

```bash
npm run db:migrate
npm run db:seed
```

`npm run db:seed` sẽ xóa dữ liệu mẫu cũ và nạp lại dữ liệu demo. Có thể chạy lại nhiều lần.

Các lệnh hữu ích khác:

```bash
npm run db:migrate:undo    # Hoàn tác migration gần nhất
npm run db:reset           # Xóa toàn bộ bảng, migrate lại và seed lại
```

### Bước 5: Chạy server

```bash
npm run dev
```

Hoặc chạy production:

```bash
npm start
```

Server mặc định chạy tại `http://localhost:3000/api/v1`.

Kiểm tra nhanh:

```bash
curl http://localhost:3000/api/v1/health
```

## 3. Tài khoản mẫu

Seeder tạo sẵn các tài khoản sau, mật khẩu chung là `123456`:

| Email | Vai trò |
| --- | --- |
| owner@example.com | Chủ dự án 1 và 2 |
| member@example.com | Thành viên dự án, chủ dự án 3 |
| chi@example.com | Thành viên dự án 1 |
| dung@example.com | Người dùng chưa tham gia dự án |

## 4. Cấu trúc thư mục

```text
task-management-api/
├── app.js                  # Cấu hình Express, static uploads, routes, error handler
├── server.js               # Kết nối database và khởi động server
├── config/
│   ├── config.js           # Cấu hình cho sequelize-cli
│   ├── database.js         # Kết nối Sequelize cho ứng dụng
│   ├── env.js              # Đọc và kiểm tra biến môi trường
│   └── upload.js           # Thư mục lưu tệp tải lên
├── constants/              # Giá trị dùng chung: trạng thái, độ ưu tiên...
├── migrations/             # Tạo bảng bằng sequelize-cli
├── seeders/                # Dữ liệu mẫu
├── models/                 # Định nghĩa model và quan hệ
├── routes/                 # Định tuyến API
├── controllers/            # Nhận request, gọi service, trả response
├── services/               # Xử lý nghiệp vụ, truy vấn qua model
├── middlewares/            # JWT, phân quyền, validation, upload, xử lý lỗi
├── utils/                  # AppError, response, pagination, validation, file
├── docs/ERD.md             # Sơ đồ ERD
├── postman/                # Postman Collection + Environment
└── uploads/                # Tệp đính kèm được Multer lưu tại đây
```

Controller không chứa truy vấn database. Mọi truy vấn nằm trong services hoặc middleware kiểm tra quyền.

## 5. Cấu trúc phản hồi

### Thành công

```json
{
  "success": true,
  "message": "Tạo dự án thành công",
  "data": { "id": 1, "name": "Website ban hang" }
}
```

### Thành công có phân trang

```json
{
  "success": true,
  "message": "Lấy danh sách công việc thành công",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 25,
    "totalPages": 3
  }
}
```

### Lỗi

```json
{
  "success": false,
  "message": "Dữ liệu đầu vào không hợp lệ",
  "data": null,
  "errors": [
    { "field": "email", "message": "Email không hợp lệ" }
  ]
}
```

Mã trạng thái được dùng: `200`, `201`, `400`, `401`, `403`, `404`, `500`.

## 6. Danh sách API

Tất cả endpoint đều có tiền tố `/api/v1`. Các endpoint có dấu `*` yêu cầu header:

```http
Authorization: Bearer <token>
```

### 6.1 Xác thực

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| POST | `/auth/register` | Đăng ký tài khoản (name, email, password) |
| POST | `/auth/login` | Đăng nhập, trả về JWT token |
| GET | `/auth/me` * | Lấy thông tin tài khoản đang đăng nhập |

### 6.2 Dự án

| Method | Endpoint | Quyền | Mô tả |
| --- | --- | --- | --- |
| GET | `/projects` * | Thành viên | Danh sách dự án do mình tạo hoặc được mời |
| POST | `/projects` * | Thành viên | Tạo dự án mới |
| GET | `/projects/:id` * | Chủ dự án / thành viên | Xem chi tiết dự án |
| PUT | `/projects/:id` * | Chủ dự án | Cập nhật dự án |
| DELETE | `/projects/:id` * | Chủ dự án | Xóa dự án và toàn bộ dữ liệu liên quan |
| GET | `/projects/:id/members` * | Chủ dự án / thành viên | Danh sách thành viên |
| POST | `/projects/:id/members` * | Chủ dự án | Thêm thành viên (`{ "userId": 2 }`) |
| DELETE | `/projects/:id/members/:userId` * | Chủ dự án | Gỡ thành viên khỏi dự án |

### 6.3 Công việc

| Method | Endpoint | Quyền | Mô tả |
| --- | --- | --- | --- |
| GET | `/projects/:projectId/tasks` * | Chủ dự án / thành viên | Danh sách, tìm kiếm, lọc, sắp xếp, phân trang |
| POST | `/projects/:projectId/tasks` * | Chủ dự án | Tạo và phân công công việc |
| GET | `/projects/:projectId/tasks/:taskId` * | Chủ dự án / thành viên | Xem chi tiết công việc |
| PUT | `/projects/:projectId/tasks/:taskId` * | Chủ dự án | Cập nhật công việc / phân công |
| DELETE | `/projects/:projectId/tasks/:taskId` * | Chủ dự án | Xóa công việc |
| PATCH | `/projects/:projectId/tasks/:taskId/status` * | Chủ dự án / người được giao | Cập nhật nhanh trạng thái |

Tham số lọc, tìm kiếm và phân trang cho danh sách công việc:

| Tham số | Giá trị | Ghi chú |
| --- | --- | --- |
| `status` | `todo`, `doing`, `done` | Lọc theo trạng thái |
| `priority` | `low`, `medium`, `high` | Lọc theo mức ưu tiên |
| `assigneeId` | số nguyên dương | Lọc theo người được giao |
| `search` | chuỗi | Tìm theo tiêu đề (LIKE) |
| `sortBy` | `createdAt`, `dueDate` | Mặc định `createdAt` |
| `order` | `asc`, `desc` | Mặc định `desc` |
| `page` | số nguyên dương | Mặc định `1` |
| `limit` | số nguyên dương, tối đa 100 | Mặc định `10` |

Ví dụ:

```http
GET /api/v1/projects/1/tasks?status=doing&priority=high&search=gio&sortBy=dueDate&order=asc&page=1&limit=5
```

### 6.4 Thống kê

| Method | Endpoint | Quyền | Mô tả |
| --- | --- | --- | --- |
| GET | `/projects/:id/statistics` * | Chủ dự án / thành viên | Tổng công việc, số lượng theo trạng thái, số việc quá hạn |
| GET | `/statistics/me` * | Thành viên | Số việc được giao và số việc đã hoàn thành của bản thân |

### 6.5 Bình luận

| Method | Endpoint | Quyền | Mô tả |
| --- | --- | --- | --- |
| GET | `/projects/:projectId/tasks/:taskId/comments` * | Chủ dự án / thành viên | Danh sách bình luận |
| POST | `/projects/:projectId/tasks/:taskId/comments` * | Chủ dự án / thành viên | Thêm bình luận (`{ "content": "..." }`) |
| DELETE | `/projects/:projectId/tasks/:taskId/comments/:commentId` * | Tác giả / chủ dự án | Xóa bình luận |

### 6.6 Tệp đính kèm

| Method | Endpoint | Quyền | Mô tả |
| --- | --- | --- | --- |
| GET | `/projects/:projectId/tasks/:taskId/attachments` * | Chủ dự án / thành viên | Danh sách tệp đính kèm |
| POST | `/projects/:projectId/tasks/:taskId/attachments` * | Chủ dự án / thành viên | Upload một tệp qua form-data field `file` |
| DELETE | `/projects/:projectId/tasks/:taskId/attachments/:attachmentId` * | Người tải lên / chủ dự án | Xóa tệp đính kèm |

Giới hạn upload: 5MB, hỗ trợ ảnh (JPEG, PNG, WEBP, GIF), PDF, Word, Excel, TXT và ZIP.

## 7. Quy tắc nghiệp vụ

- Email không được trùng; mật khẩu được hash bằng bcrypt và không bao giờ trả về trong response.
- Người dùng chỉ xem được dự án do mình tạo hoặc được mời tham gia.
- Chủ dự án có toàn quyền sửa/xóa dự án, thêm/gỡ thành viên, tạo/sửa/xóa/phân công công việc.
- Thành viên được xem công việc, bình luận, đính kèm tệp và cập nhật trạng thái công việc được giao cho mình.
- Người được giao việc phải là thành viên của dự án.
- Khi gỡ thành viên, các công việc đang giao cho người đó được chuyển về chưa có người phụ trách.
- Khi xóa dự án, công việc, bình luận, tệp đính kèm và thành viên liên quan được xóa theo khóa ngoại (`ON DELETE CASCADE`). Tệp vật lý trong thư mục `uploads/` cũng được dọn dẹp.
- Công việc quá hạn là công việc có `dueDate` nhỏ hơn ngày hiện tại và trạng thái khác `done`.

## 8. Postman

Thư mục `postman/` gồm:

- `TaskManagement.postman_collection.json`: collection phân nhóm theo chức năng (Auth, Projects, Tasks, Statistics, Comments, Attachments, Cleanup).
- `TaskManagement.postman_environment.json`: biến môi trường `baseUrl`, `token`, `memberToken`, `projectId`, `taskId`, `commentId`, `attachmentId`.
- `sample-attachment.txt`: tệp mẫu cho request upload, giúp chạy collection tự động bằng Postman Runner/Newman.

Cách dùng:

1. Import cả hai file vào Postman.
2. Chọn environment **Task Management Local**.
3. Chạy `npm run db:seed` để có tài khoản mẫu.
4. Chạy lần lượt từ folder 01 đến 07. Các request có script tự lưu `token` và ID vào biến môi trường. Folder **07 - Cleanup** xóa công việc, gỡ thành viên và xóa dự án demo ở cuối.

Lưu ý:

- Collection dùng tài khoản seeder `owner@example.com` / `123456` và `member@example.com` / `123456`.
- Request upload dùng field `file`; nếu Postman không tự tìm thấy đường dẫn, chọn tệp `postman/sample-attachment.txt` trong máy.
- Nếu `PORT` trong `.env` khác `3000`, sửa biến `baseUrl` trong Postman hoặc truyền đè khi chạy Newman bằng `--env-var baseUrl=http://localhost:<PORT>/api/v1`.
- Có thể chạy toàn bộ collection bằng Newman từ thư mục gốc dự án:

```bash
npx newman run postman/TaskManagement.postman_collection.json \
  -e postman/TaskManagement.postman_environment.json
```

## 9. ERD

Sơ đồ quan hệ dữ liệu nằm tại [`docs/ERD.md`](docs/ERD.md).

## 10. Ghi chú

- Các chức năng Quản trị viên, giao diện Front-end, thông báo thời gian thực và triển khai cloud nằm ngoài phạm vi phiên bản này.
- Dự án ưu tiên cấu trúc rõ ràng và các kỹ thuật đã học: middleware, service, ORM, transaction, migration, seeder, upload file và xử lý lỗi tập trung.
