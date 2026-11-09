# Practice 4 - Middleware tùy chỉnh: Logger và Auth

- `logger`: áp dụng toàn cục qua `app.use`, in `[METHOD] url - thời gian ISO` rồi gọi `next()`.
- `checkAuth`: chỉ gắn cục bộ cho `GET /admin/dashboard`. Thiếu header `Authorization` thì trả 401 và **không** gọi `next()`.

## Chạy

```bash
npm install
npm start
```

## Test

| # | Trường hợp | Lệnh | Status | Kết quả mong đợi |
|---|-----------|------|--------|------------------|
| 1 | Không có header | `curl http://localhost:3000/admin/dashboard` | 401 | `{"message":"Thiếu token xác thực"}` |
| 2 | Có header | `curl http://localhost:3000/admin/dashboard -H "Authorization: abc"` | 200 | `{"message":"Chào mừng Admin"}` |
| 3 | Route khác không bị ảnh hưởng | `curl http://localhost:3000/products` | 200 | `{"message":"Danh sách sản phẩm"}` |

Console mỗi request in ra dạng: `[GET] /admin/dashboard - 2026-11-09T03:30:00.000Z`

> Sau khi chạy thật, dán log/screenshot kết quả vào phần này.
