# Chạy test tự động bằng Newman

Dùng collection của Bài trước (5 request) và bổ sung 3 test case biên. Server có thêm `POST /api/v1/users/:userId/orders` để test body rỗng và JSON sai định dạng.

## Cách chạy

```bash
npm install
npm start                 # terminal 1: chạy server
npm run test:api          # terminal 2: chạy Newman, xuất báo cáo reports/report.html
```

Hoặc một lệnh duy nhất tự bật server rồi chạy test: `npm run test:api:auto`.

`test:api` trong package.json:

```
newman run postman/collection.json -e postman/env.json --reporters cli,htmlextra --reporter-htmlextra-export reports/report.html
```

## 3 test case biên bổ sung

| # | Trường hợp | Status | code |
|---|---|---|---|
| 6 | Body rỗng (POST) | 400 | EMPTY_BODY |
| 7 | JSON sai định dạng (POST) | 400 | INVALID_JSON |
| 8 | limit vượt giới hạn (limit=1000) | 400 | INVALID_LIMIT |

Response thực tế của 3 test case biên:

## Kết quả test

### 1. Biên 6: body rỗng

```bash
curl -X POST "http://localhost:3000/api/v1/users/2/orders" -H "Content-Type: application/json"
```

Status: **400 Bad Request**

```json
{
  "success": false,
  "error": {
    "code": "EMPTY_BODY",
    "message": "Body không được để trống",
    "status": 400
  }
}
```

![Biên 6: body rỗng](images/edge-empty-body.png)

### 2. Biên 7: JSON sai định dạng

```bash
curl -X POST "http://localhost:3000/api/v1/users/2/orders" -H "Content-Type: application/json" -d '{"total": 100,'
```

Status: **400 Bad Request**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_JSON",
    "message": "Body không phải JSON hợp lệ",
    "status": 400
  }
}
```

![Biên 7: JSON sai định dạng](images/edge-bad-json.png)

### 3. Biên 8: limit vượt giới hạn

```bash
curl -X GET "http://localhost:3000/api/v1/users/2/orders?limit=1000"
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

![Biên 8: limit vượt giới hạn](images/edge-limit.png)

## Báo cáo

Sau `npm run test:api`: 8 request, 16 test, 0 fail. Báo cáo HTML nằm trong `reports/`.

![Tổng hợp pass/fail](images/newman-summary.png)
