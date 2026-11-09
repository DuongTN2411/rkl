# Đặt tên endpoint theo chuẩn REST (Books)

API quản lý sách bằng mảng in-memory, 4 route, URL chỉ dùng danh từ số nhiều.

| Method | URL | Status | Ghi chú |
|---|---|---|---|
| GET | /api/v1/books | 200 | trả về danh sách |
| POST | /api/v1/books | 201 | tạo sách mới từ body, tự gán id |
| PUT | /api/v1/books/:id | 200 | cập nhật, 404 nếu không có id |
| DELETE | /api/v1/books/:id | 204 | không có body, 404 nếu không có id |

## Cách chạy

```bash
npm install
npm start
```

Server chạy tại http://localhost:3000

## Kết quả test

### 1. GET danh sách (ban đầu rỗng)

```bash
curl -X GET "http://localhost:3000/api/v1/books"
```

Status: **200 OK**

```json
{
  "success": true,
  "data": []
}
```

![GET danh sách (ban đầu rỗng)](images/get-books.png)

### 2. POST tạo sách

```bash
curl -X POST "http://localhost:3000/api/v1/books" -d '{"title":"Clean Code","author":"Robert C. Martin"}'
```

Status: **201 Created**

```json
{
  "success": true,
  "data": {
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "id": 1
  }
}
```

![POST tạo sách](images/post-books.png)

### 3. GET danh sách (sau khi tạo)

```bash
curl -X GET "http://localhost:3000/api/v1/books"
```

Status: **200 OK**

```json
{
  "success": true,
  "data": [
    {
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "id": 1
    }
  ]
}
```

![GET danh sách (sau khi tạo)](images/get-books-2.png)

### 4. PUT cập nhật sách

```bash
curl -X PUT "http://localhost:3000/api/v1/books/1" -d '{"title":"Clean Code (2nd)"}'
```

Status: **200 OK**

```json
{
  "success": true,
  "data": {
    "title": "Clean Code (2nd)",
    "author": "Robert C. Martin",
    "id": 1
  }
}
```

![PUT cập nhật sách](images/put-books.png)

### 5. DELETE xoá sách

```bash
curl -X DELETE "http://localhost:3000/api/v1/books/1"
```

Status: **204 No Content**

(không có body)

![DELETE xoá sách](images/delete-books.png)

