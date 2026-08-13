/**
 * transaction.ts — Xử lý NGHIỆP VỤ GIAO DỊCH: thêm, xóa, sắp xếp, thống kê.
 *
 * File này không biết gì về giao diện — chỉ nhận dữ liệu, kiểm tra tính
 * hợp lệ, gọi storage.ts để lưu và trả kết quả. Giao diện nằm ở ui.ts.
 */

import type { OpResult, Transaction, TxType } from './types';
import * as storage from './storage';

/** Thông tin cần thiết để tạo một giao dịch mới (người dùng nhập trên form). */
export interface TxInput {
  /** Số tiền dương, ví dụ 500000 (đơn vị: đồng) */
  amount: number;
  /** 'income' = thu, 'expense' = chi */
  type: TxType;
  /** id của danh mục đã chọn trong dropdown */
  categoryId: string;
  /** Ghi chú (có thể để trống) */
  note: string;
  /** Ngày phát sinh dạng "YYYY-MM-DD" */
  date: string;
}

/** Kiểm tra chuỗi ngày có đúng định dạng "YYYY-MM-DD" và tồn tại thật không. */
function isValidDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const year = Number(s.slice(0, 4));
  const month = Number(s.slice(5, 7));
  const day = Number(s.slice(8, 10));
  // new Date(year, month-1, day) tự "sửa" ngày không hợp lệ (02-31 → 03-03),
  // nên so sánh lại để bắt lỗi
  const d = new Date(year, month - 1, day);
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}

/**
 * Sắp xếp theo thời gian GIẢM DẦN (yêu cầu F03-3: mới nhất lên đầu):
 *  - so sánh ngày (chuỗi "YYYY-MM-DD" so theo thứ tự chữ cái = thứ tự thời gian)
 *  - cùng ngày thì giao dịch nhập sau (createdAt lớn hơn) xếp trước
 */
function sortDesc(list: Transaction[]): Transaction[] {
  const sorted = [...list]; // copy mảng để không đổi mảng gốc
  sorted.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return b.createdAt - a.createdAt;
  });
  return sorted;
}

/** Danh sách giao dịch của một tháng, đã sắp xếp mới nhất lên đầu (F03-3). */
export function listTransactions(month: string): Transaction[] {
  return sortDesc(storage.loadTransactions(month));
}

/**
 * Thêm một giao dịch mới (F03). Các bước:
 *  1. Kiểm tra dữ liệu nhập có hợp lệ không (EXTRA-1)
 *  2. Gán dấu: thu = +, chi = − (F03-2: "Lưu đúng loại thu/chi")
 *  3. Lưu vào đúng khóa của tháng chứa ngày đó (F04-3)
 */
export function addTransaction(input: TxInput): OpResult {
  const { amount, type, categoryId, note, date } = input;

  // ---- Kiểm tra nhập liệu ----
  // Số tiền phải là số dương (người dùng chọn Thu/Chi để quyết định dấu)
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: 'Số tiền phải là số nguyên dương.' };
  }
  if (!Number.isInteger(amount)) {
    return { ok: false, error: 'Số tiền phải là số nguyên (đồng).' };
  }
  // Phải chọn danh mục trong dropdown
  if (!categoryId) {
    return { ok: false, error: 'Vui lòng chọn danh mục cho giao dịch.' };
  }
  // Danh mục được chọn phải còn tồn tại trong danh sách
  const categoryExists = storage.loadCategories().some((c) => c.id === categoryId);
  if (!categoryExists) {
    return { ok: false, error: 'Danh mục không tồn tại.' };
  }
  // Ngày phải đúng định dạng và tồn tại thật trong lịch
  if (!isValidDate(date)) {
    return { ok: false, error: 'Ngày giao dịch không hợp lệ.' };
  }

  // ---- Tạo giao dịch với số tiền đã gán dấu ----
  const signed = type === 'income' ? amount : -amount;
  const tx: Transaction = {
    id: crypto.randomUUID(), // tạo id duy nhất ngẫu nhiên
    amount: signed,
    categoryId,
    note: note.trim().slice(0, 120),
    date,
    createdAt: Date.now(),
  };

  // ---- Lưu vào đúng tháng của ngày nhập ----
  const month = date.slice(0, 7); // "2026-08-15" → "2026-08"
  storage.saveTransactions(month, [...storage.loadTransactions(month), tx]);
  return { ok: true };
}

/** Xóa một giao dịch theo id (chỉ xóa trong tháng chứa nó). */
export function deleteTransaction(id: string, month: string): OpResult {
  // Lọc ra những giao dịch KHÔNG có id cần xóa
  const remaining = storage.loadTransactions(month).filter((t) => t.id !== id);
  if (remaining.length === storage.loadTransactions(month).length) {
    return { ok: false, error: 'Không tìm thấy giao dịch.' };
  }
  storage.saveTransactions(month, remaining);
  return { ok: true };
}

/** Tính tổng thu và tổng chi của một danh sách giao dịch. */
export function totTx(list: Transaction[]): { income: number; expense: number } {
  let income = 0;
  let expense = 0;
  for (const t of list) {
    if (t.amount >= 0) income += t.amount; // số dương = thu
    else expense += -t.amount; // số âm → lấy giá trị dương của nó = chi
  }
  return { income, expense };
}

/** Số dư của một danh sách giao dịch (tổng thu trừ tổng chi). */
export function balanceOf(list: Transaction[]): number {
  let result = 0;
  for (const t of list) result += t.amount;
  return result;
}