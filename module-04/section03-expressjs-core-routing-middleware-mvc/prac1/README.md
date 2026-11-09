# Practice 1 - Routing cơ bản với Express

## Chạy

```bash
npm install
npm start
```

## Test 4 route (curl)

| # | Lệnh | Kết quả mong đợi |
|---|------|------------------|
| 1 | `curl http://localhost:3000/` | `{"message":"Welcome to Bookstore API"}` |
| 2 | `curl http://localhost:3000/books` | `{"message":"Danh sách sách","data":[]}` |
| 3 | `curl -X POST http://localhost:3000/books -H "Content-Type: application/json" -d '{"title":"Clean Code","author":"Robert C. Martin"}'` | `{"message":"Tạo sách thành công","data":{"title":"Clean Code","author":"Robert C. Martin"}}` |
| 4 | `curl http://localhost:3000/books/7` | `{"message":"Chi tiết sách","id":"7"}` |

> Sau khi chạy thật, dán log/screenshot kết quả vào phần này.
