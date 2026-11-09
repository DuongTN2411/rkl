# Homework 9 - Transaction va Many-to-Many: dat hang co tru ton kho

## Cai dat va chay

```bash
npm install
cp .env.example .env
npm run seed
node server.js
```

`npm run seed` dung `sync({ force: true })` de tao lai `products` (them cot `stock`), `orders`, `order_items` va nap 5 san pham. San pham id=5 chi con ton kho 1.

## Quan he nhieu-nhieu

```js
Order.belongsToMany(Product, { through: 'order_items', foreignKey: 'order_id', otherKey: 'product_id' });
Product.belongsToMany(Order, { through: 'order_items', foreignKey: 'product_id', otherKey: 'order_id' });
```

Model `order_items` duoc khai bao truoc de co them cot `qty`; `through: 'order_items'` se dung lai model nay.

## POST /api/v1/orders

Toan bo xu ly nam trong mot transaction duy nhat, theo thu tu:

1. Kiem tra ton kho cua tung san pham (khoa dong bang `LOCK.UPDATE`).
2. Tao ban ghi trong `orders`.
3. Tao cac ban ghi `order_items`.
4. Tru `stock` bang `decrement`.

Neu bat ky san pham nao khong du ton kho, transaction bi rollback va API tra ve `409` kem ten san pham thieu hang. Cac loi khac: `400` (body sai), `404` (khong co san pham).

## Test

Dung `npm run snapshot` de in du lieu `products`, `orders`, `order_items` truoc va sau moi lan goi API. Cac request nam trong `requests.http`.

### Kich ban 1: dat hang thanh cong

Body: `{ "items": [ { "productId": 1, "qty": 2 }, { "productId": 5, "qty": 1 } ] }`

Ket qua mong doi: `201`, stock san pham 1 giam 2, stock san pham 5 giam 1, them 1 dong `orders` va 2 dong `order_items`.

| Truoc | Response | Sau |
| --- | --- | --- |
| ![](images/success-before.png) | ![](images/success-response.png) | ![](images/success-after.png) |

### Kich ban 2: thieu ton kho

Body: `{ "items": [ { "productId": 1, "qty": 2 }, { "productId": 5, "qty": 3 } ] }`

Ket qua mong doi: `409` kem ten "Chuot khong day". Bang `orders` va `order_items` khong co dong moi, stock khong doi (rollback).

| Truoc | Response | Sau |
| --- | --- | --- |
| ![](images/fail-before.png) | ![](images/fail-response.png) | ![](images/fail-after.png) |
