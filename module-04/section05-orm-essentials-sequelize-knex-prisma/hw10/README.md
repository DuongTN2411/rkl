# Homework 10 - Phat hien va khac phuc N+1 query co do luong

## Cai dat va chay

```bash
npm install
cp .env.example .env
npm run seed
node server.js
```

`npm run seed` nap 50 category, moi category co 10 product (can Node 18 tro len de chay `npm run compare`).

## Endpoint

- `GET /api/v1/report/slow`: lay danh sach category roi dung vong lap goi `Product.findAll()` cho tung category.
- `GET /api/v1/report/fast`: chi dung mot loi goi `Category.findAll()` co `include`.
- `GET /api/v1/report/fast?separate=true`: nhu `fast` nhung dung `separate: true`.

Middleware `middleware/queryMeter.js` dem so cau SQL Sequelize sinh ra trong tung request (qua `logging` cua Sequelize va `AsyncLocalStorage`) va do thoi gian xu ly, roi them vao response:

```json
{ "success": true, "data": [], "meta": { "queryCount": 51, "durationMs": 842 } }
```

Phan `data` cua `slow` va `fast` giong nhau ve noi dung vi ca hai deu qua cung ham `toDto` va sap xep theo id.

## Bang so sanh

Chay `npm run compare` (khi server dang chay) va dien so lieu that:

| Endpoint | queryCount | durationMs | Nhan xet |
| --- | --- | --- | --- |
| /slow | 51 (1 + 50) | | N+1: moi category sinh them mot cau SELECT |
| /fast | 1 | | Mot cau SELECT co LEFT OUTER JOIN |
| /fast?separate=true | 2 | | Mot cau cho category, mot cau `IN (...)` cho product |

Nhan xet: `/slow` sinh 51 cau SQL vi 1 cau lay category va 50 cau lay product, moi cau lai ton them mot luot di-ve toi database. `/fast` gom lai thanh mot cau, nen so luot di-ve giam manh va thoi gian xu ly giam theo.

## Vi sao endpoint nhanh van co the ton nhieu bo nho hon

Cau JOIN tra ve mot dong cho moi cap category - product, nen cac cot cua category bi lap lai o moi dong (500 dong thay vi 50 + 500 gia tri rieng le). Sequelize phai nhan toan bo tap ket qua phang nay vao bo nho roi gop cac dong trung lai thanh cay object, nen luong bo nho tam thoi lon hon. Khi bang con lon hoac include nhieu quan he hasMany cung luc, so dong ket qua con nhan len theo tich so (cartesian product).

## Khi nao nen dung `separate: true`

- Quan he hasMany co nhieu ban ghi con tren moi ban ghi cha, JOIN lap lai du lieu cha qua nhieu.
- Include nhieu hasMany cung luc, de tranh bung no so dong do tich so.
- Can `limit` / phan trang theo ban ghi cha, vi `limit` voi JOIN hasMany de bi cat sai (Sequelize phai dung subquery).

Doi lai `separate: true` van chi ton mot so cau SQL co dinh (khong phu thuoc so ban ghi cha), nen van tranh duoc N+1.

## Anh minh hoa

![so sanh](images/compare.png)
