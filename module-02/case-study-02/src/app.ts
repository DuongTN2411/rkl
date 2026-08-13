// app.ts — Điểm bắt đầu (Vite chạy file này trước tiên).
// Gồm 2 việc: 1) tạo dữ liệu mẫu nếu lần đầu mở app  2) gắn sự kiện + vẽ trang.

import "./styles.css";
import * as storage from "./storage";
import * as ui from "./ui";

function init(): void {
  storage.seedIfEmpty();
  ui.initUi();
}

init();
