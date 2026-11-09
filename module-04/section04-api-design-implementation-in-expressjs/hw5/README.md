# Nested Resource và Query String

Route `GET /api/v1/users/:userId/orders` hỗ trợ 2 query tuỳ chọn:

- `status`: pending | paid | cancelled (không truyền thì lấy tất cả)
- `limit`: số bản ghi trả về, mặc định 5

Quy ước: `meta.total` là tổng số đơn khớp bộ lọc (trước khi cắt theo limit). `userId` không có đơn nào trong `data/orders.js` được coi là không tồn tại và trả 404 `USER_NOT_FOUND`. Ngoài yêu cầu, API còn kiểm tra tham số: `status` sai trả 400 `INVALID_STATUS`, `limit` không hợp lệ hoặc lớn hơn 50 trả 400 `INVALID_LIMIT`.

Dữ liệu mẫu: 10 đơn của 3 user (user 2 có đúng 3 đơn paid).

## Cách chạy

```bash
npm install
npm start
```

Server chạy tại http://localhost:3000

## Kết quả test

### 1. Đủ tham số

```bash
curl -X GET "http://localhost:3000/api/v1/users/2/orders?status=paid&limit=3"
```

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

![Đủ tham số](images/full-params.png)

### 2. Không tham số

```bash
curl -X GET "http://localhost:3000/api/v1/users/2/orders"
```

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

![Không tham số](images/no-params.png)

### 3. userId không tồn tại

```bash
curl -X GET "http://localhost:3000/api/v1/users/99/orders"
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

![userId không tồn tại](images/user-not-found.png)

### 4. Bổ sung: status sai

```bash
curl -X GET "http://localhost:3000/api/v1/users/2/orders?status=shipped"
```

Status: **400 Bad Request**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_STATUS",
    "message": "status chỉ nhận: pending, paid, cancelled",
    "status": 400
  }
}
```

![Bổ sung: status sai](images/bad-status.png)

### 5. Bổ sung: limit sai

```bash
curl -X GET "http://localhost:3000/api/v1/users/2/orders?limit=abc"
```

Status: **400 Bad Request**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_LIMIT",
    "message": "limit phải là số nguyên từ 1 đến 50",
    "status": 400
  }
}
```

![Bổ sung: limit sai](images/bad-limit.png)

