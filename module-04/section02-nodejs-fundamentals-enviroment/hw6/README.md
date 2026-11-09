# Bài 6 - Dự đoán và kiểm chứng thứ tự Event Loop

## Dự đoán

1. A: Bắt đầu
2. B: Kết thúc đồng bộ
3. nextTick
4. Promise
5. setTimeout
6. setImmediate

## Kết quả thực tế

Kết quả của `node order.js`:

```
A: Bắt đầu
B: Kết thúc đồng bộ
nextTick
Promise
setTimeout
setImmediate
```

## Giải thích

Hai dòng `console.log('A: Bắt đầu')` và `console.log('B: Kết thúc đồng bộ')` là code đồng bộ nên chạy ngay theo thứ tự viết, dù `setTimeout`, `setImmediate`, `Promise` và `process.nextTick` được khai báo xen giữa. Khi code đồng bộ chạy xong, Node xử lý hàng đợi `process.nextTick` trước (in `nextTick`), rồi đến hàng đợi microtask của Promise (callback `.then` in `Promise`), nên hai dòng này luôn đứng ngay sau dòng B dù được khai báo sau `setTimeout` và `setImmediate`. Sau đó mới đến macrotask: `setTimeout(..., 0)` thuộc pha timers còn `setImmediate` thuộc pha check của Event Loop. Khi được gọi trực tiếp từ file chạy chính, thứ tự giữa hai dòng cuối không cố định: tôi chạy `node order.js` 5 lần thì 2 lần `setTimeout` đứng trước và 3 lần `setImmediate` đứng trước, vì timer 0ms có đến hạn hay chưa tại thời điểm vòng lặp bắt đầu phụ thuộc vào tốc độ máy.
