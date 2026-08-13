/**
 * app.ts — ĐIỂM BẮT ĐẦU (entry point) của ứng dụng.
 *
 * Khi bạn chạy `npm run dev`, Vite đọc index.html, thấy dòng
 *   <script type="module" src="/src/app.ts">
 * và chạy file này trước tiên.
 *
 * app.ts CHỈ làm 2 việc rất nhỏ (không chứa nghiệp vụ nào khác):
 *   1. Tạo dữ liệu mẫu nếu là lần đầu chạy (seedIfEmpty)
 *   2. Gọi initUi() để gắn sự kiện + vẽ trang
 * Mọi việc còn lại nằm trong các module chuyên biệt (xem README):
 *   storage.ts / category.ts / transaction.ts / ui.ts
 */

import './styles.css'; // nạp file CSS cho toàn trang
import * as storage from './storage';
import * as ui from './ui';

function init(): void {
  // Lần đầu mở app, localStorage chưa có gì → tạo dữ liệu mẫu (NFR-7)
  storage.seedIfEmpty();

  // Gắn sự kiện + vẽ toàn bộ giao diện lần đầu
  ui.initUi();
}

// Bắt đầu chạy ứng dụng
init();