# Practice 5 - Route Chaining với app.route()

Một lần khai báo `app.route('/tasks/:id')` gắn chuỗi `.get().put().delete()`.
Nếu `id` không tồn tại, cả 3 method đều trả 404 kèm thông báo rõ ràng.

## Chạy

```bash
npm install
npm start
```

## Test

| # | Lệnh | Status | Kết quả mong đợi |
|---|------|--------|------------------|
| 1 | `curl http://localhost:3000/tasks/1` | 200 | `{"id":1,"title":"Học Express","done":false}` |
| 2 | `curl -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d '{"done":true}'` | 200 | task sau cập nhật, `done: true` |
| 3 | `curl -X DELETE http://localhost:3000/tasks/1` | 200 | `{"message":"Đã xóa task 1"}` |
| 4 | `curl http://localhost:3000/tasks/999` | 404 | `{"message":"Không tìm thấy task 999"}` |
| 5 | `curl -X PUT http://localhost:3000/tasks/999 -H "Content-Type: application/json" -d '{"done":true}'` | 404 | `{"message":"Không tìm thấy task 999"}` |
| 6 | `curl -X DELETE http://localhost:3000/tasks/999` | 404 | `{"message":"Không tìm thấy task 999"}` |

> Sau khi chạy thật, dán log/screenshot kết quả vào phần này.
