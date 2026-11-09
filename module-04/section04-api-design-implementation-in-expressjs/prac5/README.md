# URI Versioning với v1 và v2

Hai version chạy cùng lúc trên một server. Dữ liệu chỉ khai báo một lần trong `data/users.js` (dạng `{ id, firstName, lastName, email }`), mỗi router tự chuyển đổi khi trả về.

## So sánh field v1 và v2

| Field | v1 | v2 | Ghi chú |
|---|---|---|---|
| id | có | có | giữ nguyên |
| name | có | **bỏ** | v1 là `firstName + " " + lastName` |
| firstName | không | **có (tách ra)** | tách từ name |
| lastName | không | **có (tách ra)** | tách từ name |
| email | có | có | giữ nguyên |

Field bị tách: `name` -> `firstName` + `lastName`. Field bị bỏ: `name` (ở v2).

## Cách chạy

```bash
npm install
npm start
```

Server chạy tại http://localhost:3000

## Kết quả test

### 1. GET /api/v1/users

```bash
curl -X GET "http://localhost:3000/api/v1/users"
```

Status: **200 OK**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "An Nguyen",
      "email": "an@example.com"
    },
    {
      "id": 2,
      "name": "Binh Tran",
      "email": "binh@example.com"
    },
    {
      "id": 3,
      "name": "Chi Le",
      "email": "chi@example.com"
    }
  ],
  "meta": {
    "total": 3
  }
}
```

![GET /api/v1/users](images/v1-users.png)

### 2. GET /api/v2/users

```bash
curl -X GET "http://localhost:3000/api/v2/users"
```

Status: **200 OK**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "firstName": "An",
      "lastName": "Nguyen",
      "email": "an@example.com"
    },
    {
      "id": 2,
      "firstName": "Binh",
      "lastName": "Tran",
      "email": "binh@example.com"
    },
    {
      "id": 3,
      "firstName": "Chi",
      "lastName": "Le",
      "email": "chi@example.com"
    }
  ],
  "meta": {
    "total": 3
  }
}
```

![GET /api/v2/users](images/v2-users.png)

### 3. GET /api/v1/users/1

```bash
curl -X GET "http://localhost:3000/api/v1/users/1"
```

Status: **200 OK**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "An Nguyen",
    "email": "an@example.com"
  }
}
```

![GET /api/v1/users/1](images/v1-user-1.png)

### 4. GET /api/v2/users/1

```bash
curl -X GET "http://localhost:3000/api/v2/users/1"
```

Status: **200 OK**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "An",
    "lastName": "Nguyen",
    "email": "an@example.com"
  }
}
```

![GET /api/v2/users/1](images/v2-user-1.png)

