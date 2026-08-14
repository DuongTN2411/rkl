// transaction.ts — Nghiệp vụ giao dịch: thêm, xóa, sắp xếp, thống kê

import { Transaction, Totals } from "./types";
import * as storage from "./storage";
import { getCategory } from "./category";

/** Kiểm tra "YYYY-MM-DD" đúng định dạng và là ngày tồn tại thật */
function isValidDate(s: string): boolean {
  const parts = s.split("-");
  if (parts.length !== 3) return false;
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (month === 2 && day > 29) return false;
  if ((month === 4 || month === 6 || month === 9 || month === 11) && day > 30)
    return false;
  return year >= 2000; // năm phải hợp lý (form date luôn gửi "20xx-..")
}

/** Giao dịch của tháng "YYYY-MM", mới nhất lên đầu */
export function listTransactions(month: string): Transaction[] {
  const list = storage.loadTransactions(month);
  const result: Transaction[] = [];
  // Duyệt từ cuối mảng (mới nhất) nên mới nhất hiện lên đầu
  for (let i = list.length - 1; i >= 0; i--) {
    result.push(list[i]);
  }
  return result;
}

/** Tìm giao dịch theo id (ở mọi tháng), không có -> null */
export function findTransaction(id: string): Transaction | null {
  const months = storage.allTxMonths();
  for (const m of months) {
    const list = storage.loadTransactions(m);
    for (const t of list) {
      if (t.id === id) return t;
    }
  }
  return null;
}

/** Thêm giao dịch; trả về thông báo lỗi, hoặc null nếu thành công */
export function addTransaction(
  amount: number,
  type: string, // "income" = thu, "expense" = chi
  categoryId: string,
  note: string,
  date: string
): string | null {
  // Kiểm tra dữ liệu nhập
  if (amount <= 0 || amount % 1 !== 0)
    return "Số tiền phải là số nguyên dương.";
  if (categoryId === "") return "Vui lòng chọn danh mục cho giao dịch.";
  if (getCategory(categoryId) === null) return "Danh mục không tồn tại.";
  if (!isValidDate(date)) return "Ngày giao dịch không hợp lệ.";

  // Tạo giao dịch (thu = +, chi = −) rồi lưu vào đúng tháng của ngày đó
  const month = date.slice(0, 7);
  const tx: Transaction = {
    id: storage.newId(),
    amount: type === "income" ? amount : -amount,
    categoryId,
    note: note.trim().slice(0, 120),
    date,
    createdAt: Date.now(),
  };
  storage.saveTransactions(month, [...storage.loadTransactions(month), tx]);
  return null;
}

/** Xóa giao dịch theo id (tìm trong tháng đang xem) */
export function deleteTransaction(id: string, month: string): string | null {
  const list = storage.loadTransactions(month);
  const newList: Transaction[] = [];
  let found = false;
  for (const t of list) {
    if (t.id === id) {
      found = true;
    } else {
      newList.push(t);
    }
  }
  if (!found) return "Không tìm thấy giao dịch.";
  storage.saveTransactions(month, newList);
  return null;
}

// ---------- Thống kê ----------

/** Tổng thu và tổng chi của một danh sách giao dịch */
export function getTotals(txs: Transaction[]): Totals {
  let income = 0;
  let expense = 0;
  for (const t of txs) {
    if (t.amount >= 0) income += t.amount;
    else expense += -t.amount;
  }
  return { income, expense };
}

/** Số dư hiện tại = tổng thu − tổng chi (của MỌI tháng) */
export function getBalance(): number {
  let total = 0;
  const months = storage.allTxMonths();
  for (const m of months) {
    const list = storage.loadTransactions(m);
    for (const t of list) total += t.amount;
  }
  return total;
}

/** Số giao dịch của toàn bộ app (hiển thị trên Dashboard) */
export function countTransactions(): number {
  let count = 0;
  const months = storage.allTxMonths();
  for (const m of months) {
    count += storage.loadTransactions(m).length;
  }
  return count;
}
