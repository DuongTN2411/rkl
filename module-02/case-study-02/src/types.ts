// types.ts — Kiểu dữ liệu dùng chung

// Một danh mục chi tiêu: "Ăn uống", "Xăng xe"...
export interface Category {
  id: string;
  name: string;
  limit: number | null; // hạn mức/tháng (VND), null = không giới hạn
  createdAt: number; // thời điểm tạo, dùng để sắp xếp
}

// Một giao dịch thu/chi
export interface Transaction {
  id: string;
  amount: number; // dương (+) = thu, âm (−) = chi
  categoryId: string; // thuộc danh mục nào
  note: string; // ghi chú, có thể để trống
  date: string; // "YYYY-MM-DD"
  createdAt: number;
}

// Tổng thu / tổng chi
export interface Totals {
  income: number;
  expense: number;
}

// Tình hình chi tiêu của một danh mục
export interface CatSpend {
  category: Category;
  spent: number; // đã chi
  percent: number; // % so với hạn mức
  overLimit: boolean; // có vượt hạn mức không
}