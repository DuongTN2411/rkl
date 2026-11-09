# Bài 10 - So sánh CommonJS và ES Module trên dự án thực tế

Hai thư mục `project-cjs/` và `project-esm/` được làm từ dự án Bài 9, cùng 4 file `config.js`, `orderService.js`, `logger.js`, `index.js`, cùng file `.env`. Khi chạy `node index.js`, cả hai in ra cùng 4 dòng log (created #1, created #2, processed #1, processed #2), chỉ khác giá trị timestamp.

## 1. Khác biệt trong cấu hình package.json

Bản CJS không khai báo `type` (Node mặc định coi file `.js` là CommonJS):

```json
{
  "name": "project-cjs",
  "main": "index.js",
  "dependencies": { "dotenv": "^16.4.5" }
}
```

Bản ESM phải thêm đúng một dòng `"type": "module"`:

```json
{
  "name": "project-esm",
  "main": "index.js",
  "type": "module",
  "dependencies": { "dotenv": "^16.4.5" }
}
```

Ngoài `package.json`, code cũng đổi theo: `require('events')` thành `import { EventEmitter } from 'node:events'`, `module.exports = ...` thành `export default ...`, và mọi import file nội bộ phải ghi đủ đuôi `.js`.

## 2. Lỗi và khó khăn chỉ gặp ở bản ESM

- **Quên đuôi `.js` khi import file nội bộ.** Viết `import config from './config'` trong `orderService.js` thì Node báo `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../e1/config' imported from .../e1/orderService.js`. Khắc phục: viết `./config.js`. Ở CJS, `require('./config')` không cần đuôi.
- **Còn sót `require` trong file ESM.** Giữ nguyên dòng `const dotenv = require('dotenv');` trong `config.js` thì lỗi là `ReferenceError: require is not defined in ES module scope, you can use import instead`. Khắc phục: đổi thành `import dotenv from 'dotenv'`.
- **Không có `__dirname`.** Thêm `console.log(__dirname)` vào file ESM thì báo `ReferenceError: __dirname is not defined in ES module scope`. Khắc phục: dùng `path.dirname(fileURLToPath(import.meta.url))`. Ở CJS biến này có sẵn.

## 3. So sánh trải nghiệm debug

Tôi cố tình `throw new Error('Loi thu nghiem')` trong `createOrder` ở cả hai bản và so sánh stack trace:

- Bản CJS hiển thị đường dẫn thường: `at OrderService.createOrder (.../c4/orderService.js:6:11)`, theo sau là nhiều dòng nội bộ như `Module._compile`, `Module.load`, `Function._load`. Dấu `^` chỉ vào đầu từ khóa `throw`.
- Bản ESM hiển thị đường dẫn dạng URL: `at OrderService.createOrder (file://.../e4/orderService.js:6:11)`, và các dòng nội bộ là `ModuleJob.run`, `asyncRunEntryPointWithESMLoader`. Dấu `^` chỉ vào `new Error`, không phải `throw`.
- Thông báo lỗi của ESM ở các trường hợp ở mục 2 đều kèm gợi ý cách sửa (`Did you mean to import "./config.js"?`, `rename to use the '.cjs' file extension`), còn lỗi sai đường dẫn ở bản ESM xảy ra ngay khi nạp module, trước khi dòng code nào chạy.

## 4. Kết luận

Nhóm nên dùng **ES Module** cho dự án backend mới, vì ba lý do rút ra từ quá trình làm bài:

1. Chi phí chuyển đổi thấp: chỉ cần thêm `"type": "module"`, đổi cú pháp import/export và thêm đuôi `.js`. Chức năng và output không đổi.
2. Thông báo lỗi của Node với ESM nêu rõ nguyên nhân và cách sửa, nên các lỗi ở mục 2 đều xử lý được trong vài phút.
3. Cú pháp `import/export` giống code frontend, giúp cả nhóm viết một kiểu cho cả hai phía.

Điểm đánh đổi cần nhớ là phải ghi đuôi `.js` khi import và không có sẵn `__dirname`.
