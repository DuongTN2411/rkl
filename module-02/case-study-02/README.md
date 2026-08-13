# 💳 E-Wallet — Quản lý chi tiêu cá nhân

Ứng dụng web **Personal Finance Manager** xây dựng bằng **TypeScript + Vite**, dữ liệu lưu cục bộ qua **localStorage**. Ghi chép thu/chi, quản lý danh mục, đặt hạn mức, xem báo cáo theo tháng và cảnh báo khi vượt ngân sách.

## 🚀 Cài đặt & chạy

Yêu cầu: Node.js ≥ 18.

```bash
npm install      # cài dependency
npm run dev      # chạy dev server, tự mở http://localhost:5173
npm run build    # kiểm tra TypeScript strict + đóng gói production
npm run preview  # xem bản build
```

> Lần đầu mở, dữ liệu mẫu (seed) tự động được tạo cho tháng hiện tại và 2 tháng trước (NFR-7).

## ✨ Tính năng

| Nhóm | Chi tiết |
|---|---|
| **F01 Dashboard** | Số dư hiện tại cập nhật realtime (xanh khi dương, đỏ khi âm); tổng thu/chi của tháng; thanh tiến trình ngân sách tổng kèm trạng thái **✅ Đạt / ⚠️ Vượt x%**; hộp cảnh báo vượt hạn mức |
| **F02 Danh mục** | Thêm / sửa / xóa (có kiểm tra ràng buộc: không xóa được danh mục còn giao dịch); hạn mức riêng từng danh mục; bảng hiển thị hạn mức + đã chi + % |
| **F03 Giao dịch** | Form đủ: số tiền, loại Thu/Chi (radio), danh mục (dropdown), ghi chú, ngày; lưu đúng dấu `+`/`−`; lịch sử sắp xếp **giảm dần**; xóa giao dịch đồng bộ lại Dashboard/Danh mục |
| **F04 Lọc thời gian** | Month Picker `‹ ›` ở header; mọi view theo tháng chọn; dữ liệu lưu **riêng từng tháng** (`ewallet:tx:<YYYY-MM>`) |
| **F05 Cảnh báo & Thống kê** | Cảnh báo màu đỏ + badge `⚠️ vượt x%`; bảng tổng hợp các tháng (thu, chi, chênh lệch, thanh so sánh) — seed sẵn 3 tháng |

## 🧱 Kiến trúc module

```
case-study-02/
├── index.html          # khung HTML: header, tabs, 4 section chức năng
├── tsconfig.json       # strict, noImplicitAny, noUnusedLocals, ...
├── package.json
└── src/
    ├── app.ts          # entry point: khởi tạo, gắn sự kiện, điều phối
    ├── ui.ts           # render toàn bộ DOM, toast, định dạng tiền
    ├── category.ts     # nghiệp vụ danh mục (CRUD, hạn mức, vượt hạn mức)
    ├── transaction.ts  # nghiệp vụ giao dịch (thêm/xóa, sắp xếp, thống kê)
    ├── storage.ts      # lớp lưu trữ localStorage an toàn + seed
    ├── types.ts        # interface: Category, Transaction, TxType, ...
    └── styles.css      # responsive, xanh = thu, đỏ = chi
```

Toàn bộ code không dùng `any`; kiểu dữ liệu rõ ràng (`interface`), có comment tiếng Việt giải thích từng hàm.

## 📖 Đọc code theo thứ tự nào (cho người mới học TS/Vite)

Dòng chảy của app rất đơn giản, mỗi file chỉ làm đúng một vai:

```
1. index.html       Khung trang: header (Month Picker), 4 tab, các form & bảng.
                    Cuối file có dòng <script src="/src/app.ts"> — Vite chạy nó trước.

2. src/app.ts       Nhỏ nhất: seed dữ liệu mẫu rồi gọi ui.initUi().
                    Từ đây mọi việc được "giao" cho các file khác.

3. src/ui.ts        Vẽ giao diện + xử lý nút bấm/form.
                    Hàm quan trọng nhất là refreshAll(): đọc dữ liệu mới nhất
                    từ các file nghiệp vụ rồi vẽ lại TOÀN BỘ trang.
                    → Gọi sau mỗi thao tác thêm/sửa/xóa.

4. src/storage.ts   Đọc/ghi localStorage. Đây là "ổ cứng" của app.
                    Chú ý: mỗi tháng lưu một khóa riêng ewallet:tx:2026-08.

5. src/category.ts  Nghiệp vụ danh mục: kiểm tra tên, hạn mức, tính vượt hạn mức.
6. src/transaction.ts Nghiệp vụ giao dịch: kiểm tra nhập liệu, sắp xếp, thống kê.
7. src/types.ts     Khai báo các interface (khuôn mẫu dữ liệu) dùng chung.
8. src/styles.css   Màu sắc + bố cục responsive.
```

> Mẹo đọc: file nào cũng có comment trước mỗi hàm với mẫu "Hàm này làm gì".
> Cú pháp lạ như `data-del-tx` chỉ là tên attribute tự đặt để tìm nút — không phải thứ gì đặc biệt.

## 💾 localStorage

| Key | Nội dung |
|---|---|
| `ewallet:categories` | danh sách danh mục (dùng chung mọi tháng) |
| `ewallet:tx:<YYYY-MM>` | giao dịch của riêng từng tháng |
| `ewallet:selectedMonth` | tháng đang xem trên Month Picker |
| `ewallet:seeded` | cờ đã chạy seed dữ liệu mẫu |

- **Tự động lưu** sau mỗi thao tác thêm/sửa/xóa (NFR-3).
- Đọc dữ liệu có `try/catch` + type guard chống crash, load lại trang không mất dữ liệu.

## 🎨 UI/UX

- Màu **xanh lá `green`** cho thu/số dư dương, **đỏ `red`** cho chi/cảnh báo (NFR-6).
- Responsive bằng Grid/Flex; dưới 640px chuyển layout cột dọc, bảng cuộn ngang (NFR-5).
- Toast thông báo kết quả; `confirm()` trước khi xóa dữ liệu; xử lý lỗi nhập liệu đầy đủ (EXTRA-1).