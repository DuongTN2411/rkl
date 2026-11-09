# Chuẩn hoá Response Format (Student)

Hai hàm `sendSuccess(res, status, data, meta)` và `sendError(res, status, code, message)` nằm trong `utils/response.js`. Các route không gọi `res.json()` trực tiếp.

- Danh sách: `data` là mảng, kèm `meta.total`.
- Chi tiết (`/:id`): `data` là một object, không có `meta`.

## Cách chạy

```bash
npm install
npm start
```

Server chạy tại http://localhost:3000

## Kết quả test

### 1. Thành công - 200 OK (danh sách)

```bash
curl -X GET "http://localhost:3000/api/v1/students"
```

Status: **200 OK**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Nguyen Van A",
      "score": 8.5
    },
    {
      "id": 2,
      "name": "Tran Thi B",
      "score": 9
    },
    {
      "id": 3,
      "name": "Le Van C",
      "score": 7.25
    }
  ],
  "meta": {
    "total": 3
  }
}
```

![Thành công - 200 OK (danh sách)](images/students-ok.png)

### 2. Thành công - 200 OK (chi tiết)

```bash
curl -X GET "http://localhost:3000/api/v1/students/1"
```

Status: **200 OK**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Nguyen Van A",
    "score": 8.5
  }
}
```

![Thành công - 200 OK (chi tiết)](images/students-id-ok.png)

### 3. Lỗi - 404 Not Found

```bash
curl -X GET "http://localhost:3000/api/v1/students/99"
```

Status: **404 Not Found**

```json
{
  "success": false,
  "error": {
    "code": "STUDENT_NOT_FOUND",
    "message": "Không tìm thấy sinh viên",
    "status": 404
  }
}
```

![Lỗi - 404 Not Found](images/students-404.png)

