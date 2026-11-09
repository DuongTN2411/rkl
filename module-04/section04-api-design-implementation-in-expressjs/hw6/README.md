# Header Versioning và Deprecation

Route `GET /api/books` giữ nguyên URL, version quyết định bởi header `Api-Version` (middleware `middlewares/versionResolver.js`). Không truyền header thì mặc định v1.

- v1: `data` gồm `{ id, title, author }` (author là chuỗi), kèm header `Deprecation: true` và `Sunset: Wed, 31 Dec 2025 23:59:59 GMT`.
- v2: `data` gồm `{ id, title, author: { id, name }, publishedYear }`.
- Version khác (ví dụ v9): 400 `UNSUPPORTED_API_VERSION`.

Cả hai version dùng chung một nguồn dữ liệu `data/books.js`, chỉ khác bước format.

## Cách chạy

```bash
npm install
npm start
```

Server chạy tại http://localhost:3000

## Kết quả test

### 1. v1 (Api-Version: v1) - có header Deprecation/Sunset

```bash
curl -i -X GET "http://localhost:3000/api/books" -H "Api-Version: v1"
```

Status: **200 OK**

Headers:

```
Deprecation: true
Sunset: Wed, 31 Dec 2025 23:59:59 GMT
```

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Clean Code",
      "author": "Robert C. Martin"
    },
    {
      "id": 2,
      "title": "The Pragmatic Programmer",
      "author": "Andrew Hunt"
    },
    {
      "id": 3,
      "title": "Refactoring",
      "author": "Martin Fowler"
    }
  ],
  "meta": {
    "total": 3
  }
}
```

![v1 (Api-Version: v1) - có header Deprecation/Sunset](images/v1-headers.png)

### 2. Không truyền header -> mặc định v1

```bash
curl -i -X GET "http://localhost:3000/api/books"
```

Status: **200 OK**

Headers:

```
Deprecation: true
Sunset: Wed, 31 Dec 2025 23:59:59 GMT
```

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Clean Code",
      "author": "Robert C. Martin"
    },
    {
      "id": 2,
      "title": "The Pragmatic Programmer",
      "author": "Andrew Hunt"
    },
    {
      "id": 3,
      "title": "Refactoring",
      "author": "Martin Fowler"
    }
  ],
  "meta": {
    "total": 3
  }
}
```

![Không truyền header -> mặc định v1](images/default-v1.png)

### 3. v2

```bash
curl -i -X GET "http://localhost:3000/api/books" -H "Api-Version: v2"
```

Status: **200 OK**

Headers:

```
(không có header deprecation)
(không có header sunset)
```

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Clean Code",
      "author": {
        "id": 1,
        "name": "Robert C. Martin"
      },
      "publishedYear": 2008
    },
    {
      "id": 2,
      "title": "The Pragmatic Programmer",
      "author": {
        "id": 2,
        "name": "Andrew Hunt"
      },
      "publishedYear": 1999
    },
    {
      "id": 3,
      "title": "Refactoring",
      "author": {
        "id": 3,
        "name": "Martin Fowler"
      },
      "publishedYear": 1999
    }
  ],
  "meta": {
    "total": 3
  }
}
```

![v2](images/v2.png)

### 4. v9 -> 400

```bash
curl -X GET "http://localhost:3000/api/books" -H "Api-Version: v9"
```

Status: **400 Bad Request**

```json
{
  "success": false,
  "error": {
    "code": "UNSUPPORTED_API_VERSION",
    "message": "Api-Version \"v9\" không được hỗ trợ. Các version hợp lệ: v1, v2",
    "status": 400
  }
}
```

![v9 -> 400](images/v9.png)

