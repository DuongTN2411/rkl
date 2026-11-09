# Middleware xử lý lỗi tập trung

Refactor API của Bài 3:

- `utils/ApiError.js`: class `ApiError` mang `status` và `code`.
- Trong route chỉ gọi `next(new ApiError(...))`, không tự trả lỗi.
- `app.js`: error middleware 4 tham số đặt cuối cùng, là nơi duy nhất trả lỗi.
- `GET /api/v1/boom` cố tình throw lỗi để kiểm tra server trả JSON 500 mà không crash.

## Cách chạy

```bash
npm install
npm start
```

Server chạy tại http://localhost:3000

## Kết quả test

### 1. Lỗi 404 (ApiError)

```bash
curl -X GET "http://localhost:3000/api/v1/users/99"
```

Status: **404 Not Found**

```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "Không tìm thấy user",
    "status": 404
  }
}
```

![Lỗi 404 (ApiError)](images/error-404.png)

### 2. Lỗi 500 (throw Error ở /boom)

```bash
curl -X GET "http://localhost:3000/api/v1/boom"
```

Status: **500 Internal Server Error**

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Lỗi cố tình để kiểm tra middleware",
    "status": 500
  }
}
```

![Lỗi 500 (throw Error ở /boom)](images/error-500.png)

### 3. Server vẫn sống sau lỗi 500

```bash
curl -X GET "http://localhost:3000/api/v1/users/1"
```

Status: **200 OK**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Nguyen Van A",
    "email": "a@example.com"
  }
}
```

![Server vẫn sống sau lỗi 500](images/still-alive.png)

## Kiểm tra: chỉ còn một nơi tự trả lỗi

```bash
grep -rn "success: false" --include=*.js .
```

```
./app.js:22:    success: false,
```

