# Homework 6 - Xây dựng API theo kiến trúc MVC

```
hw6/
├── models/Product.js                  # duy nhất được đọc/ghi mảng products
├── controllers/productController.js   # chỉ gọi Model rồi trả response
├── routes/productRoutes.js            # GET / và POST /
└── app.js                             # express.json() + app.use('/api/products', ...)
```

| Lớp | Vai trò |
|-----|---------|
| Model | Giữ mảng `products`; export `getAll`, `create` (id tự tăng), `findById` |
| Controller | `getProducts`, `createProduct`, không đụng trực tiếp vào mảng |
| Route | Map `GET /` và `POST /` tới controller |
| app.js | Khởi tạo app, gắn middleware và router, không có logic nghiệp vụ |

## Chạy

```bash
npm install
npm start
```

## Test

| # | Lệnh | Status | Kết quả mong đợi |
|---|------|--------|------------------|
| 1 | `curl http://localhost:3000/api/products` | 200 | mảng 3 sản phẩm mẫu |
| 2 | `curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d '{"name":"Màn hình LG 27","price":449,"quantity":15}'` | 201 | `{"id":4,"name":"Màn hình LG 27","price":449,"quantity":15}` |
| 3 | `curl http://localhost:3000/api/products` | 200 | mảng có 4 sản phẩm |
