// types.ts — Kiểu dữ liệu dùng chung (type = "khuôn mẫu" của một đối tượng).

// Một danh mục chi tiêu, ví dụ: "Ăn uống", "Xăng xe"
export type Category = {
  id: string; // id duy nhất
  name: string; // tên hiển thị
  limit: number | null; // hạn mức/tháng (VND), null = không giới hạn
  createdAt: number; // thời điểm tạo (ms), dùng để sắp xếp
};

// Một giao dịch thu/chi
export type Transaction = {
  id: string;
  amount: number; // dương (+) = thu, âm (−) = chi
  categoryId: string; // id danh mục giao dịch thuộc về
  note: string; // ghi chú, có thể trống
  date: string; // "YYYY-MM-DD"
  createdAt: number; // thời điểm tạo (ms), dùng để sắp xếp
};