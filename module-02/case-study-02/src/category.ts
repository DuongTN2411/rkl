import { Category, CatSpend } from "./types";
import * as storage from "./storage";

/** Toàn bộ danh mục (theo thứ tự tạo) */
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

/** "1000000" -> số; trống -> null; không hợp lệ -> undefined */
function parseLimit(text: string): number | null | undefined {
  if (text === "") return null;
  const n = Number(text);
  if (isNaN(n) || n < 0 || n % 1 !== 0) return undefined;
  return n;
}

/** Thêm danh mục; trả về lỗi hoặc null nếu thành công */
export function addCategory(name: string, limitRaw: string): string | null {
  const trimmed = name.trim();
  const limitText = limitRaw.trim();

  if (trimmed === "") return "Tên danh mục không được để trống.";
  if (trimmed.length > 40) return "Tên danh mục tối đa 40 ký tự.";
  for (const c of storage.loadCategories()) {
    if (c.name.toLowerCase() === trimmed.toLowerCase()) {
      return `Danh mục "${trimmed}" đã tồn tại.`;
    }
  }

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

  const old = getCategory(id);
  if (old === null) return "Không tìm thấy danh mục.";

  if (trimmed === "") return "Tên danh mục không được để trống.";
  if (trimmed.length > 40) return "Tên danh mục tối đa 40 ký tự.";
  for (const c of storage.loadCategories()) {
    if (c.name.toLowerCase() === trimmed.toLowerCase() && c.id !== id) {
      return `Danh mục "${trimmed}" đã tồn tại.`;
    }
  }

  const limit = parseLimit(limitText);
  if (limit === undefined) {
    return "Hạn mức phải là số nguyên ≥ 0 (để trống = không giới hạn).";
  }

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

/** Xóa danh mục; không cho xóa nếu còn giao dịch thuộc nó */
export function deleteCategory(id: string): string | null {
  const target = getCategory(id);
  if (target === null) return "Không tìm thấy danh mục.";

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

/** Tổng hạn mức của tất cả danh mục */
export function totalLimit(): number {
  let sum = 0;
  for (const c of storage.loadCategories()) {
    if (c.limit !== null) sum += c.limit;
  }
  return sum;
}

/** Chi tiêu từng danh mục trong tháng: đã chi, %, có vượt không */
export function getSpends(month: string): CatSpend[] {
  const txs = storage.loadTransactions(month);
  const cats = storage.loadCategories();
  const result: CatSpend[] = [];
  for (const c of cats) {
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