# Kiểm thử API bằng Postman Collection

Collection kiểm thử API của Bài 5 (Nested Resource). Server nằm cùng thư mục để chạy độc lập.

## Cách dùng

1. `npm install` rồi `npm start` (server chạy tại http://localhost:3000).
2. Postman: Import `postman/collection.json` và `postman/env.json`, chọn environment **Local** (biến `base_url`).
3. Mở Collection Runner, chạy cả collection.

## Nội dung

- Environment chứa biến `base_url`, cả 5 request đều dùng `{{base_url}}`, không ghi trực tiếp localhost.
- 5 request, mỗi request có 2 test script: kiểm tra status code và kiểm tra cấu trúc response.

| # | Request | Status mong đợi |
|---|---|---|
| 1 | GET {{base_url}}/api/v1/users/2/orders?status=paid&limit=3 | 200 |
| 2 | GET {{base_url}}/api/v1/users/2/orders | 200 |
| 3 | GET {{base_url}}/api/v1/users/1/orders?status=pending | 200 |
| 4 | GET {{base_url}}/api/v1/users/3/orders?limit=2 | 200 |
| 5 | GET {{base_url}}/api/v1/users/99/orders (lỗi 404) | 404 |

Response thực tế của từng request (chạy từ cùng source code này):

## Kết quả test

### 1. Request 1

`GET /api/v1/users/2/orders?status=paid&limit=3`

Status: **200 OK**

```json
{
  "success": true,
  "data": [
    {
      "id": 4,
      "userId": 2,
      "status": "paid",
      "total": 200000
    },
    {
      "id": 5,
      "userId": 2,
      "status": "paid",
      "total": 150000
    },
    {
      "id": 7,
      "userId": 2,
      "status": "paid",
      "total": 300000
    }
  ],
  "meta": {
    "total": 3
  }
}
```

### 2. Request 2

`GET /api/v1/users/2/orders`

Status: **200 OK**

```json
{
  "success": true,
  "data": [
    {
      "id": 4,
      "userId": 2,
      "status": "paid",
      "total": 200000
    },
    {
      "id": 5,
      "userId": 2,
      "status": "paid",
      "total": 150000
    },
    {
      "id": 6,
      "userId": 2,
      "status": "pending",
      "total": 90000
    },
    {
      "id": 7,
      "userId": 2,
      "status": "paid",
      "total": 300000
    }
  ],
  "meta": {
    "total": 4
  }
}
```

### 3. Request 3

`GET /api/v1/users/1/orders?status=pending`

Status: **200 OK**

```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "userId": 1,
      "status": "pending",
      "total": 80000
    }
  ],
  "meta": {
    "total": 1
  }
}
```

### 4. Request 4

`GET /api/v1/users/3/orders?limit=2`

Status: **200 OK**

```json
{
  "success": true,
  "data": [
    {
      "id": 8,
      "userId": 3,
      "status": "paid",
      "total": 70000
    },
    {
      "id": 9,
      "userId": 3,
      "status": "cancelled",
      "total": 60000
    }
  ],
  "meta": {
    "total": 3
  }
}
```

### 5. Request 5 (404)

`GET /api/v1/users/99/orders`

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

## Báo cáo Collection Runner

Chạy Collection Runner, kết quả 5/5 request và 10/10 test PASS:

![Collection Runner](images/collection-runner.png)
