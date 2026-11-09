# Practice 2 - Route Params và Query String

- `req.params`: phần nằm trong path (`/products/:id`).
- `req.query`: phần sau dấu `?` (`?sort=asc&limit=10`).
- Mặc định: `sort = "desc"`, `limit = "20"`.

## Chạy

```bash
npm install
npm start
```

## Test

| # | Trường hợp | Lệnh | Kết quả mong đợi |
|---|-----------|------|------------------|
| 1 | Đủ tham số | `curl "http://localhost:3000/products/42?sort=asc&limit=10"` | `{"productId":"42","sort":"asc","limit":"10"}` |
| 2 | Thiếu `sort` | `curl "http://localhost:3000/products/42?limit=10"` | `{"productId":"42","sort":"desc","limit":"10"}` |
| 3 | Thiếu cả `sort` và `limit` | `curl "http://localhost:3000/products/42"` | `{"productId":"42","sort":"desc","limit":"20"}` |

> Sau khi chạy thật, dán log/screenshot kết quả vào phần này.
