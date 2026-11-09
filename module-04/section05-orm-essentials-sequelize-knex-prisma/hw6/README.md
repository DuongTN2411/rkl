# Homework 6 - Phan trang, loc va sap xep voi findAndCountAll

## Cai dat va chay

```bash
npm install
cp .env.example .env
npm run seed
node server.js
```

`npm run seed` nap 46 san pham (23 san pham co chu "Sach" trong ten).

## Query string

| Tham so | Hanh vi |
| --- | --- |
| page | Mac dinh 1. Ep ve so nguyen, gia tri am hoac bang 0 quay ve mac dinh |
| limit | Mac dinh 10, toi da 50. Ep ve so nguyen, gia tri am hoac bang 0 quay ve mac dinh |
| keyword | Tim gan dung theo ten bang `Op.like` (ky tu `%`, `_` duoc escape) |
| sort | `price_asc`, `price_desc`, mac dinh `id_desc` |

Response co khoi `meta` voi `total` lay tu `findAndCountAll`:

```json
{ "success": true, "data": [], "meta": { "page": 2, "limit": 10, "total": 46, "totalPages": 5 } }
```

## 4 request test

Cac request nam trong `requests.http`. Dan ket qua that vao tung muc.

### 1. Du tham so

`GET /api/v1/products?page=2&limit=10&keyword=sach&sort=price_asc`

```json
```

### 2. Chi keyword

`GET /api/v1/products?keyword=sach`

```json
```

### 3. Chi sort

`GET /api/v1/products?sort=price_desc`

```json
```

### 4. Khong tham so

`GET /api/v1/products`

```json
```
