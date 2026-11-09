# Chọn đúng Status Code cho từng loại lỗi

Route `POST /api/v1/users` nhận `{ name, email }`. Lỗi dùng lại cấu trúc `{ success: false, error: { code, message, status } }` của Bài 2. Không trường hợp lỗi nào trả 200.

| Trường hợp | Status | code |
|---|---|---|
| Thiếu name hoặc email | 400 | MISSING_FIELD |
| email sai định dạng | 422 | VALIDATION_ERROR |
| email đã tồn tại trong mảng | 409 | EMAIL_EXISTS |
| Dữ liệu hợp lệ | 201 | trả về user vừa tạo |

Dữ liệu seed có sẵn user `a@example.com` để test lỗi 409.

## Cách chạy

```bash
npm install
npm start
```

Server chạy tại http://localhost:3000

## Kết quả test

### 1. Thiếu email -> 400

```bash
curl -X POST "http://localhost:3000/api/v1/users" -d '{"name":"Nguyen Van B"}'
```

Status: **400 Bad Request**

```json
{
  "success": false,
  "error": {
    "code": "MISSING_FIELD",
    "message": "Thiếu name hoặc email",
    "status": 400
  }
}
```

![Thiếu email -> 400](images/users-400.png)

### 2. Email sai định dạng -> 422

```bash
curl -X POST "http://localhost:3000/api/v1/users" -d '{"name":"Nguyen Van B","email":"abc"}'
```

Status: **422 Unprocessable Entity**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email sai định dạng",
    "status": 422
  }
}
```

![Email sai định dạng -> 422](images/users-422.png)

### 3. Email đã tồn tại -> 409

```bash
curl -X POST "http://localhost:3000/api/v1/users" -d '{"name":"Nguyen Van B","email":"a@example.com"}'
```

Status: **409 Conflict**

```json
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "Email đã tồn tại",
    "status": 409
  }
}
```

![Email đã tồn tại -> 409](images/users-409.png)

### 4. Dữ liệu hợp lệ -> 201

```bash
curl -X POST "http://localhost:3000/api/v1/users" -d '{"name":"Nguyen Van B","email":"b@example.com"}'
```

Status: **201 Created**

```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Nguyen Van B",
    "email": "b@example.com"
  }
}
```

![Dữ liệu hợp lệ -> 201](images/users-201.png)

