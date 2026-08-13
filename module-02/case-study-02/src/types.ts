/**
 * types.ts — Nơi khai báo CÁC KIỂU DỮ LIỆU (interface) dùng chung cho cả app.
 *
 * interface là "khuôn mẫu" của một đối tượng: nó cho TypeScript biết
 * mỗi đối tượng sẽ có những trường (property) nào và kiểu của từng trường.
 * Nhờ vậy, khi viết code ta gõ sai tên trường hay gán sai kiểu dữ liệu
 * là trình biên dịch báo lỗi ngay (không phải đợi chạy mới biết).
 */

/**
 * Một DANH MỤC chi tiêu, ví dụ: Ăn uống, Xăng xe, Mua sắm...
 */
export interface Category {
  /** Chuỗi định danh duy nhất, sinh ra bởi crypto.randomUUID() */
  id: string;
  /** Tên hiển thị, ví dụ: "Ăn uống" */
  name: string;
  /**
   * Hạn mức chi tiêu cho mỗi tháng (đơn vị: đồng).
   * Có thể là null = "không giới hạn".
   */
  limit: number | null;
  /** Thời điểm tạo danh mục (millisecond), chỉ để sắp xếp thứ tự */
  createdAt: number;
}

/**
 * Một GIAO DỊCH thu/chi.
 */
export interface Transaction {
  /** Chuỗi định danh duy nhất */
  id: string;
  /**
   * SỐ TIỀN đã kèm dấu:
   *   - số DƯƠNG (+) → là khoản THU
   *   - số ÂM (−)    → là khoản CHI
   */
  amount: number;
  /** id của danh mục mà giao dịch này thuộc về */
  categoryId: string;
  /** Ghi chú khi nhập (có thể để trống) */
  note: string;
  /** Ngày phát sinh, dạng chuỗi "YYYY-MM-DD", ví dụ "2026-08-15" */
  date: string;
  /** Thời điểm tạo giao dịch (millisecond), dùng để sắp xếp thứ tự nhập */
  createdAt: number;
}

/** Loại giao dịch mà người dùng chọn trên form (radio Thu / Chi). */
export type TxType = 'income' | 'expense';

/** Tình hình chi tiêu của một danh mục trong tháng (dùng cho danh sách danh mục và cảnh báo). */
export interface CategorySpend {
  /** Danh mục được thống kê */
  category: Category;
  /** Tổng số tiền ĐÃ CHI trong tháng (giá trị dương) */
  spent: number;
  /** true nếu đã chi vượt hạn mức (chỉ xét khi danh mục có limit) */
  overLimit: boolean;
  /** Phần trăm hạn mức đã dùng: spent / limit × 100 (0 nếu không có limit) */
  percent: number;
}

/** Kết quả của một thao tác ghi dữ liệu (thêm / sửa / xóa).
 *  ok = true  → thành công
 *  ok = false → thất bại, error chứa lời nhắn hiển thị cho người dùng
 */
export interface OpResult {
  ok: boolean;
  error?: string;
}

/** Tổng thu và tổng chi của một tháng (dùng cho bảng báo cáo). */
export interface MonthSummary {
  /** Khóa tháng dạng "YYYY-MM", ví dụ "2026-08" */
  key: string;
  income: number;
  expense: number;
}