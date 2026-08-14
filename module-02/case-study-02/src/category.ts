// category.ts — Nghiệp vụ danh mục: thêm, sửa, xóa, hạn mức, thống kê chi

import { Category, CatSpend } from "./types";
import * as storage from "./storage";

// ---------- Xem ----------

/** Toàn bộ danh mục (hiển thị theo thứ tự tạo) */
export function getCategories(): Category[] {
  return storage.loadCategories();
}

/** Tìm danh mục theo id, không có -> null */
export function getCategory(id: string): Category | null {
  const list = storage.loadCategories();
  for (const c of list) {
    if (c.id === id) return c;
  }
  return null;
}

// ---------- Thêm / sửa / xóa ----------

/** "1000000" -> số; để trống -> null (không giới hạn); không hợp lệ -> undefined */
function parseLimit(text: string): number | null | undefined {
  if (text === "") return null;
  const n = Number(text);
  if (isNaN(n) || n < 0 || n % 1 !== 0) return undefined;
  return n;
}

/** Thêm danh mục; trả về thông báo lỗi, hoặc null nếu thành công */
export function addCategory(name: string, limitRaw: string): string | null {
  const trimmed = name.trim();
  const limitText = limitRaw.trim();

  // Kiểm tra tên
  if (trimmed === "") return "Tên danh mục không được để trống.";
  if (trimmed.length > 40) return "Tên danh mục tối đa 40 ký tự.";
  for (const c of storage.loadCategories()) {
    if (c.name.toLowerCase() === trimmed.toLowerCase()) {
      return `Danh mục "${trimmed}" đã tồn tại.`;
    }
  }

  // Kiểm tra hạn mức
  const limit = parseLimit(limitText);
  if (limit === undefined) {
    return "Hạn mức phải là số nguyên ≥ 0 (để trống = không giới hạn).";
  }

  storage.saveCategories([
    ...storage.loadCategories(),
    { id: storage.newId(), name: trimmed, limit, createdAt: Date.now() },
  ]);
  return null;
}

/** Sửa tên / hạn mức của một danh mục */
export function updateCategory(
  id: string,
  name: string,
  limitRaw: string
): string | null {
  const trimmed = name.trim();
  const limitText = limitRaw.trim();

  // Kiểm tra danh mục có tồn tại
  const old = getCategory(id);
  if (old === null) return "Không tìm thấy danh mục.";

  // Kiểm tra tên (bỏ qua chính danh mục đang sửa)
  if (trimmed === "") return "Tên danh mục không được để trống.";
  if (trimmed.length > 40) return "Tên danh mục tối đa 40 ký tự.";
  for (const c of storage.loadCategories()) {
    if (c.name.toLowerCase() === trimmed.toLowerCase() && c.id !== id) {
      return `Danh mục "${trimmed}" đã tồn tại.`;
    }
  }

  // Kiểm tra hạn mức
  const limit = parseLimit(limitText);
  if (limit === undefined) {
    return "Hạn mức phải là số nguyên ≥ 0 (để trống = không giới hạn).";
  }

  // Thay danh mục cũ bằng danh mục mới (giữ nguyên id và createdAt)
  const newList: Category[] = [];
  for (const c of storage.loadCategories()) {
    if (c.id === id) {
      newList.push({
        id: c.id,
        name: trimmed,
        limit,
        createdAt: old.createdAt,
      });
    } else {
      newList.push(c);
    }
  }
  storage.saveCategories(newList);
  return null;
}

/** Xóa danh mục; không cho xóa nếu vẫn còn giao dịch thuộc nó */
export function deleteCategory(id: string): string | null {
  const target = getCategory(id);
  if (target === null) return "Không tìm thấy danh mục.";

  // Đếm số giao dịch thuộc danh mục này (ở mọi tháng)
  let count = 0;
  const months = storage.allTxMonths();
  for (const m of months) {
    const list = storage.loadTransactions(m);
    for (const t of list) {
      if (t.categoryId === id) count++;
    }
  }
  if (count > 0) {
    return `Không thể xóa "${target.name}" vì vẫn còn ${count} giao dịch thuộc danh mục này.`;
  }

  const newList: Category[] = [];
  for (const c of storage.loadCategories()) {
    if (c.id !== id) newList.push(c);
  }
  storage.saveCategories(newList);
  return null;
}

// ---------- Thống kê ----------

/** Tổng hạn mức của tất cả danh mục ("ngân sách tháng") */
export function totalLimit(): number {
  let sum = 0;
  for (const c of storage.loadCategories()) {
    if (c.limit !== null) sum += c.limit;
  }
  return sum;
}

/** Tình hình chi tiêu từng danh mục trong tháng: đã chi, %, có vượt không */
export function getSpends(month: string): CatSpend[] {
  const txs = storage.loadTransactions(month);
  const cats = storage.loadCategories();
  const result: CatSpend[] = [];
  for (const c of cats) {
    // Đếm tổng tiền đã chi của danh mục này
    let spent = 0;
    for (const t of txs) {
      if (t.categoryId === c.id && t.amount < 0) spent += -t.amount;
    }
    result.push({
      category: c,
      spent,
      percent: c.limit !== null && c.limit > 0 ? (spent / c.limit) * 100 : 0,
      overLimit: c.limit !== null && c.limit > 0 && spent > c.limit,
    });
  }
  return result;
}
