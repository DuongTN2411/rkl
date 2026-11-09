# Bài 9 - Mini hệ thống xử lý đơn hàng

## Chuẩn module đã chọn: CommonJS (CJS)

Toàn bộ dự án (`config.js`, `orderService.js`, `logger.js`, `index.js`) dùng thống nhất `require()` và `module.exports`.

Lý do chọn:

- `dotenv` và `events` đều dùng được trực tiếp bằng `require()` mà không cần cấu hình thêm, `package.json` không cần khai báo `"type": "module"`.
- Dự án nhỏ, chỉ có 4 file nên không cần các tính năng riêng của ES Module.
- Việc `config.js` đọc `.env` bằng `require('dotenv').config()` chạy tuần tự, đúng thứ tự file được nạp, nên các module khác đọc được `config` ngay khi `require('./config')`.
