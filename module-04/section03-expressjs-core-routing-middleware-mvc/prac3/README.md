# Practice 3 - Tách Router bằng express.Router()

```
prac3/
├── app.js
└── routes/studentRoutes.js
```

## Chạy

```bash
npm install
npm start
```

## Test

| # | Lệnh | Status | Kết quả mong đợi |
|---|------|--------|------------------|
| 1 | `curl http://localhost:3000/api/students` | 200 | mảng sinh viên |
| 2 | `curl -X POST http://localhost:3000/api/students -H "Content-Type: application/json" -d '{"name":"Lê Văn C","score":7.5}'` | 201 | `{"id":3,"name":"Lê Văn C","score":7.5}` |
| 3 | `curl http://localhost:3000/api/students/1` | 200 | sinh viên id 1 |
| 4 | `curl -X DELETE http://localhost:3000/api/students/1` | 200 | dữ liệu sinh viên vừa xóa |
| 5 | `curl -X DELETE http://localhost:3000/api/students/999` | 404 | `{"message":"Không tìm thấy sinh viên"}` |

> Sau khi chạy thật, dán log/screenshot kết quả vào phần này.
