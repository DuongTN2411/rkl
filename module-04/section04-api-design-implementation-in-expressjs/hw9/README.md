# Thêm links vào response (HATEOAS)

Route `GET /api/v2/orders/:id` trả thêm khối `_links` (đặt trong `data`) liệt kê các hành động client có thể thực hiện. Danh sách link sinh bởi hàm dùng chung `buildOrderLinks(order)` trong `utils/links.js`, route không chứa logic if theo status.

- `self` và `customer`: luôn có.
- `cancel`: chỉ có khi đơn ở trạng thái `pending`.

Để link `cancel` có ý nghĩa, server có thêm `POST /api/v2/orders/:id/cancellation` và `GET /api/v2/users/:id`.

## HATEOAS giúp API đạt Level 3 như thế nào so với Level 2

- **Level 2**: API đã dùng đúng resource (URL) và HTTP method/status code. Nhưng client phải tự biết trước có thể làm gì tiếp (ví dụ phải tự hardcode "đơn pending thì mới gọi POST .../cancellation") nên bị gắn chặt với tài liệu API.
- **Level 3 (HATEOAS)**: response tự mô tả hành động tiếp theo qua `_links`. Client chỉ cần kiểm tra link `cancel` có xuất hiện hay không để hiện nút Huỷ, đi theo `href` và `method` được cung cấp. Khi quy tắc nghiệp vụ hoặc URL thay đổi, server đổi `_links`, client không phải sửa code.

## Cách chạy

```bash
npm install
npm start
```

Server chạy tại http://localhost:3000

## Kết quả test

### 1. Đơn hàng pending (có link cancel)

```bash
curl -X GET "http://localhost:3000/api/v2/orders/17"
```

Status: **200 OK**

```json
{
  "success": true,
  "data": {
    "id": 17,
    "userId": 3,
    "status": "pending",
    "total": 250000,
    "_links": {
      "self": {
        "href": "/api/v2/orders/17",
        "method": "GET"
      },
      "cancel": {
        "href": "/api/v2/orders/17/cancellation",
        "method": "POST"
      },
      "customer": {
        "href": "/api/v2/users/3",
        "method": "GET"
      }
    }
  }
}
```

![Đơn hàng pending (có link cancel)](images/pending.png)

### 2. Đơn hàng cancelled (không có link cancel)

```bash
curl -X GET "http://localhost:3000/api/v2/orders/18"
```

Status: **200 OK**

```json
{
  "success": true,
  "data": {
    "id": 18,
    "userId": 3,
    "status": "cancelled",
    "total": 120000,
    "_links": {
      "self": {
        "href": "/api/v2/orders/18",
        "method": "GET"
      },
      "customer": {
        "href": "/api/v2/users/3",
        "method": "GET"
      }
    }
  }
}
```

![Đơn hàng cancelled (không có link cancel)](images/cancelled.png)

### 3. Bổ sung: huỷ đơn 17 rồi links tự đổi

```bash
curl -X POST "http://localhost:3000/api/v2/orders/17/cancellation"
```

Status: **200 OK**

```json
{
  "success": true,
  "data": {
    "id": 17,
    "userId": 3,
    "status": "cancelled",
    "total": 250000,
    "_links": {
      "self": {
        "href": "/api/v2/orders/17",
        "method": "GET"
      },
      "customer": {
        "href": "/api/v2/users/3",
        "method": "GET"
      }
    }
  }
}
```

![Bổ sung: huỷ đơn 17 rồi links tự đổi](images/cancel-action.png)

