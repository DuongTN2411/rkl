/**
 * category.ts — Xử lý NGHIỆP VỤ DANH MỤC: thêm, sửa, xóa, hạn mức (F02).
 *
 * Tương tự transaction.ts: file này không biết gì về giao diện,
 * chỉ kiểm tra tính hợp lệ rồi gọi storage.ts để lưu.
 */

import type { Category, CategorySpend, OpResult, Transaction } from './types';
import * as storage from './storage';

/** Đọc toàn bộ danh mục, sắp theo thời điểm tạo (cũ trước, mới sau). */
export function getCategories(): Category[] {
  const list = storage.loadCategories();
  list.sort((a, b) => a.createdAt - b.createdAt);
  return list;
}

/** Tìm một danh mục theo id; trả về undefined nếu không có. */
export function getCategory(id: string): Category | undefined {
  return storage.loadCategories().find((c) => c.id === id);
}

/**
 * Chuyển chuỗi hạn mức người dùng nhập thành số (hoặc null).
 * - "" (để trống)        → null = không giới hạn (EXTRA-1)
 * - số nguyên ≥ 0        → số đó
 * - sai định dạng        → báo lỗi
 */
function parseLimit(raw: string): { ok: boolean; error?: string; value: number | null } {
  const trimmed = raw.trim();
  if (trimmed === '') return { ok: true, value: null };

  const n = Number(trimmed);
  if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) {
    return { ok: false, error: 'Hạn mức phải là số nguyên ≥ 0 (để trống = không giới hạn).', value: null };
  }
  return { ok: true, value: n };
}

/**
 * Kiểm tra tên danh mục: không rỗng, không quá dài, không trùng tên
 * (excludeId dùng khi SỬA: không tính danh mục đang sửa là "trùng").
 */
function nameError(name: string, excludeId?: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'Tên danh mục không được để trống.';
  if (trimmed.length > 40) return 'Tên danh mục tối đa 40 ký tự.';

  for (const c of storage.loadCategories()) {
    if (c.name.toLowerCase() === trimmed.toLowerCase() && c.id !== excludeId) {
      return `Danh mục "${trimmed}" đã tồn tại.`;
    }
  }
  return null;
}

/** Thêm một danh mục mới (F02-1). */
export function addCategory(name: string, limitRaw: string): OpResult {
  const nameErr = nameError(name);
  if (nameErr) return { ok: false, error: nameErr };

  const limit = parseLimit(limitRaw);
  if (!limit.ok) return { ok: false, error: limit.error };

  const cat: Category = {
    id: crypto.randomUUID(),
    name: name.trim(),
    limit: limit.value,
    createdAt: Date.now(),
  };
  storage.saveCategories([...storage.loadCategories(), cat]);
  return { ok: true };
}

/** Cập nhật tên / hạn mức của danh mục có id (F02-2). */
export function updateCategory(
  id: string,
  name: string,
  limitRaw: string,
): OpResult {
  const list = storage.loadCategories();
  const target = list.find((c) => c.id === id);
  if (!target) return { ok: false, error: 'Không tìm thấy danh mục.' };

  const nameErr = nameError(name, id);
  if (nameErr) return { ok: false, error: nameErr };

  const limit = parseLimit(limitRaw);
  if (!limit.ok) return { ok: false, error: limit.error };

  // Ghi đè các trường được sửa, giữ nguyên id và createdAt
  const updated: Category = { ...target, name: name.trim(), limit: limit.value };
  storage.saveCategories(list.map((c) => (c.id === id ? updated : c)));
  return { ok: true };
}

/**
 * Xóa danh mục (F02-3) có KIỂM TRA RÀNG BUỘC:
 * nếu danh mục vẫn còn giao dịch (ở bất kỳ tháng nào) thì KHÔNG cho xóa,
 * vì xóa sẽ làm lịch sử giao dịch mất gốc.
 */
export function deleteCategory(id: string): OpResult {
  const list = storage.loadCategories();
  const target = list.find((c) => c.id === id);
  if (!target) return { ok: false, error: 'Không tìm thấy danh mục.' };

  // Đếm số giao dịch thuộc danh mục này ở TẤT CẢ các tháng
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

/**
 * Tổng hạn mức của TẤT CẢ danh mục có limit (gọi là "ngân sách tổng
 * của tháng"). Dùng cho thanh tiến trình trên Dashboard (F01-3).
 */
export function totalLimit(list: Category[]): number {
  let sum = 0;
  for (const c of list) {
    if (c.limit !== null) sum += c.limit;
  }
  return sum;
}

/**
 * Tính TÌNH HÌNH CHI TIÊU của từng danh mục trong một tháng (F02-5):
 * đã chi bao nhiêu, có vượt hạn mức không, đạt bao nhiêu phần trăm.
 * Nhận danh sách giao dịch của tháng đó + danh sách danh mục.
 */
export function categorySpends(cats: Category[], txs: Transaction[]): CategorySpend[] {
  // Bước 1: gom tổng chi theo từng danh mục bằng một "cuốn sổ" dạng
  //         { idDanhMuc: số đã chi } — giống object thường, dễ đọc.
  const spentByCat: Record<string, number> = {};
  for (const t of txs) {
    if (t.amount < 0) {
      // Cú pháp spentByCat[...] ?? 0 nghĩa là "lấy giá trị cũ, nếu chưa có thì lấy 0"
      spentByCat[t.categoryId] = (spentByCat[t.categoryId] ?? 0) + -t.amount;
    }
  }

  // Bước 2: với mỗi danh mục, so sánh đã chi với hạn mức
  const result: CategorySpend[] = [];
  for (const category of cats) {
    const spent = spentByCat[category.id] ?? 0;
    const hasLimit = category.limit !== null && category.limit > 0;
    const percent = hasLimit ? (spent / (category.limit as number)) * 100 : 0;
    result.push({
      category,
      spent,
      overLimit: hasLimit && spent > (category.limit as number),
      percent,
    });
  }
  return result;
}