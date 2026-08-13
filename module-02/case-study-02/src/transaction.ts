// transaction.ts — Nghiệp vụ GIAO DỊCH: thêm, xóa, sắp xếp, thống kê.

import type { Transaction } from "./types";
import * as storage from "./storage";

/** Dữ liệu người dùng nhập trên form thêm giao dịch. */
export type TxInput = {
  amount: number; // số tiền dương
  type: string; // 'income' = thu, 'expense' = chi
  categoryId: string;
  note: string;
  date: string; // "YYYY-MM-DD"
};

/** Kiểm tra "YYYY-MM-DD" đúng định dạng và tồn tại thật trong lịch. */
function isValidDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const year = Number(s.slice(0, 4));
  const month = Number(s.slice(5, 7));
  const day = Number(s.slice(8, 10));
  const d = new Date(year, month - 1, day);
  return (
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day
  );
}

/** Giao dịch của một tháng, mới nhất lên đầu (cùng ngày thì nhập sau xếp trước). */
export function listTransactions(month: string): Transaction[] {
  return [...storage.loadTransactions(month)].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return b.createdAt - a.createdAt;
  });
}

/** Thêm giao dịch: kiểm tra dữ liệu → gán dấu thu/chi → lưu vào đúng tháng. */
export function addTransaction(input: TxInput): any {
  const { amount, type, categoryId, note, date } = input;

  if (!Number.isFinite(amount) || amount <= 0 || !Number.isInteger(amount)) {
    return { ok: false, error: "Số tiền phải là số nguyên dương." };
  }
  if (!categoryId)
    return { ok: false, error: "Vui lòng chọn danh mục cho giao dịch." };
  if (!storage.loadCategories().some((c) => c.id === categoryId)) {
    return { ok: false, error: "Danh mục không tồn tại." };
  }
  if (!isValidDate(date))
    return { ok: false, error: "Ngày giao dịch không hợp lệ." };

  // Số tiền có dấu: thu = +, chi = −
  const tx: Transaction = {
    id: crypto.randomUUID(),
    amount: type === "income" ? amount : -amount,
    categoryId,
    note: note.trim().slice(0, 120),
    date,
    createdAt: Date.now(),
  };
  // Lưu vào khóa của tháng chứa ngày đó: "2026-08-15" → "2026-08"
  const month = date.slice(0, 7);
  storage.saveTransactions(month, [...storage.loadTransactions(month), tx]);
  return { ok: true };
}

/** Xóa giao dịch theo id (trong tháng chứa nó). */
export function deleteTransaction(id: string, month: string): any {
  const before = storage.loadTransactions(month);
  const remaining = before.filter((t) => t.id !== id);
  if (remaining.length === before.length)
    return { ok: false, error: "Không tìm thấy giao dịch." };
  storage.saveTransactions(month, remaining);
  return { ok: true };
}

/** Tổng thu và tổng chi của một danh sách giao dịch. */
export function totTx(list: Transaction[]): any {
  let income = 0;
  let expense = 0;
  for (const t of list) {
    if (t.amount >= 0) income += t.amount;
    else expense += -t.amount;
  }
  return { income, expense };
}

/** Số dư = tổng thu − tổng chi. */
export function balanceOf(list: Transaction[]): number {
  return list.reduce((s, t) => s + t.amount, 0);
}
