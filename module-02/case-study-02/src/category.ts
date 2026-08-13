// category.ts — Nghiệp vụ DANH MỤC: thêm, sửa, xóa, hạn mức.

import type { Category, Transaction } from "./types";
import * as storage from "./storage";

/** Toàn bộ danh mục, cũ trước mới sau. */
export function getCategories(): Category[] {
  const list = storage.loadCategories();
  list.sort((a, b) => a.createdAt - b.createdAt);
  return list;
}

/** Tìm một danh mục theo id. */
export function getCategory(id: string): Category | undefined {
  return storage.loadCategories().find((c) => c.id === id);
}

/** "1.000.000" nhập từ form → số; để trống → null (không giới hạn). */
function parseLimit(raw: string): any {
  const trimmed = raw.trim();
  if (trimmed === "") return { ok: true, value: null };
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) {
    return {
      ok: false,
      error: "Hạn mức phải là số nguyên ≥ 0 (để trống = không giới hạn).",
      value: null,
    };
  }
  return { ok: true, value: n };
}

/** Kiểm tra tên: không rỗng, ≤ 40 ký tự, không trùng (excludeId bỏ qua khi sửa). */
function nameError(name: string, excludeId?: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return "Tên danh mục không được để trống.";
  if (trimmed.length > 40) return "Tên danh mục tối đa 40 ký tự.";
  for (const c of storage.loadCategories()) {
    if (c.name.toLowerCase() === trimmed.toLowerCase() && c.id !== excludeId) {
      return `Danh mục "${trimmed}" đã tồn tại.`;
    }
  }
  return null;
}

export function addCategory(name: string, limitRaw: string): any {
  const nameErr = nameError(name);
  if (nameErr) return { ok: false, error: nameErr };
  const limit = parseLimit(limitRaw);
  if (!limit.ok) return { ok: false, error: limit.error };
  storage.saveCategories([
    ...storage.loadCategories(),
    {
      id: crypto.randomUUID(),
      name: name.trim(),
      limit: limit.value,
      createdAt: Date.now(),
    },
  ]);
  return { ok: true };
}

export function updateCategory(
  id: string,
  name: string,
  limitRaw: string
): any {
  const list = storage.loadCategories();
  const target = list.find((c) => c.id === id);
  if (!target) return { ok: false, error: "Không tìm thấy danh mục." };
  const nameErr = nameError(name, id);
  if (nameErr) return { ok: false, error: nameErr };
  const limit = parseLimit(limitRaw);
  if (!limit.ok) return { ok: false, error: limit.error };
  storage.saveCategories(
    list.map((c) =>
      c.id === id ? { ...c, name: name.trim(), limit: limit.value } : c
    )
  );
  return { ok: true };
}

/** Xóa danh mục; không cho xóa nếu vẫn còn giao dịch thuộc nó (ở mọi tháng). */
export function deleteCategory(id: string): any {
  const list = storage.loadCategories();
  const target = list.find((c) => c.id === id);
  if (!target) return { ok: false, error: "Không tìm thấy danh mục." };
  let txCount = 0;
  for (const month of storage.allTxMonths()) {
    for (const t of storage.loadTransactions(month)) {
      if (t.categoryId === id) txCount++;
    }
  }
  if (txCount > 0) {
    return {
      ok: false,
      error: `Không thể xóa "${target.name}" vì vẫn còn ${txCount} giao dịch thuộc danh mục này.`,
    };
  }
  storage.saveCategories(list.filter((c) => c.id !== id));
  return { ok: true };
}

/** Tổng hạn mức của tất cả danh mục (="ngân sách tháng" trên Dashboard). */
export function totalLimit(list: Category[]): number {
  return list.reduce((sum, c) => sum + (c.limit ?? 0), 0);
}

/** Tình hình chi tiêu từng danh mục trong tháng: đã chi, %, có vượt hạn mức không. */
export function categorySpends(cats: Category[], txs: Transaction[]): any[] {
  const spentByCat: any = {};
  for (const t of txs) {
    if (t.amount < 0)
      spentByCat[t.categoryId] = (spentByCat[t.categoryId] ?? 0) + -t.amount;
  }
  return cats.map((category) => {
    const spent = spentByCat[category.id] ?? 0;
    const hasLimit = category.limit !== null && category.limit > 0;
    return {
      category,
      spent,
      overLimit: hasLimit && spent > (category.limit as number),
      percent: hasLimit ? (spent / (category.limit as number)) * 100 : 0,
    };
  });
}
