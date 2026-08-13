// storage.ts — Đọc/ghi dữ liệu vào localStorage (trình duyệt tự nhớ khi đóng tab).
//
// QUY ƯỚC ĐẶT KHÓA (key):
//   ewallet:categories    → danh sách danh mục (dùng chung mọi tháng)
//   ewallet:tx:2026-08    → giao dịch riêng của từng tháng
//   ewallet:selectedMonth → tháng đang xem trên Month Picker
//   ewallet:seeded        → cờ "đã tạo dữ liệu mẫu chưa"

import type { Category, Transaction } from "./types";

const CATEGORIES_KEY = "ewallet:categories";
const SELECTED_MONTH_KEY = "ewallet:selectedMonth";
const SEED_FLAG_KEY = "ewallet:seeded";
const TX_PREFIX = "ewallet:tx:";

/* ============================================================
   Tiện ích thời gian
   ============================================================ */

/** Date → "YYYY-MM". */
function monthKeyOf(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
}

/** Tháng hiện tại theo đồng hồ máy. */
export function currentMonthKey(): string {
  return monthKeyOf(new Date());
}

/** Ngày hôm nay dạng "YYYY-MM-DD" (ngày mặc định của form). */
export function todayKey(): string {
  const d = new Date();
  return `${monthKeyOf(d)}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Cộng/trừ tháng: shiftMonth("2026-08", -1) → "2026-07". */
export function shiftMonth(month: string, delta: number): string {
  const d = new Date(
    Number(month.slice(0, 4)),
    Number(month.slice(5, 7)) - 1 + delta,
    1
  );
  return monthKeyOf(d);
}

/* ============================================================
   Đọc/ghi an toàn
   ============================================================ */

/** Đọc khóa → mảng; chưa có hoặc JSON hỏng thì trả về []. */
function readArray(key: string): any[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** Kiểm tra phần tử có đủ các trường của Transaction không (sai thì bỏ qua). */
function isOkTransaction(item: any): boolean {
  return (
    typeof item.id === "string" &&
    typeof item.amount === "number" &&
    Number.isFinite(item.amount) &&
    typeof item.categoryId === "string" &&
    typeof item.date === "string"
  );
}

/** Tương tự cho Category. */
function isOkCategory(item: any): boolean {
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    (typeof item.limit === "number" || item.limit === null) &&
    typeof item.createdAt === "number"
  );
}

/* ============================================================
   Danh mục
   ============================================================ */

export function loadCategories(): Category[] {
  return readArray(CATEGORIES_KEY).filter(isOkCategory) as Category[];
}

export function saveCategories(list: Category[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(list));
}

/* ============================================================
   Giao dịch — mỗi tháng một khóa riêng
   ============================================================ */

function txKey(month: string): string {
  return `${TX_PREFIX}${month}`;
}

export function loadTransactions(month: string): Transaction[] {
  return readArray(txKey(month)).filter(isOkTransaction) as Transaction[];
}

export function saveTransactions(month: string, list: Transaction[]): void {
  localStorage.setItem(txKey(month), JSON.stringify(list));
}

/** Các tháng đang có dữ liệu, tháng mới nhất trước. */
export function allTxMonths(): string[] {
  const months: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(TX_PREFIX))
      months.push(key.slice(TX_PREFIX.length));
  }
  months.sort((a, b) => (a < b ? 1 : -1));
  return months;
}

/** Gộp giao dịch của tất cả các tháng (dùng để tính số dư tổng). */
export function loadAllTransactions(): Transaction[] {
  return allTxMonths().flatMap((m) => loadTransactions(m));
}

/* ============================================================
   Tháng đang xem trên Month Picker
   ============================================================ */

export function loadSelectedMonth(): string {
  const m = localStorage.getItem(SELECTED_MONTH_KEY);
  return m && /^\d{4}-\d{2}$/.test(m) ? m : currentMonthKey();
}

export function saveSelectedMonth(month: string): void {
  localStorage.setItem(SELECTED_MONTH_KEY, month);
}

/* ============================================================
   Dữ liệu mẫu — tạo 1 lần khi lần đầu mở app
   ============================================================ */

export function seedIfEmpty(): void {
  if (localStorage.getItem(SEED_FLAG_KEY)) return;
  const now = Date.now();

  // 6 danh mục mẫu kèm hạn mức
  const cats: Category[] = [
    { id: "c-food", name: "Ăn uống", limit: 3_000_000, createdAt: now },
    { id: "c-fuel", name: "Xăng xe", limit: 800_000, createdAt: now },
    { id: "c-shop", name: "Mua sắm", limit: 2_000_000, createdAt: now },
    { id: "c-fun", name: "Giải trí", limit: 800_000, createdAt: now },
    { id: "c-bill", name: "Hóa đơn", limit: 1_500_000, createdAt: now },
    { id: "c-sal", name: "Lương", limit: null, createdAt: now },
  ];
  saveCategories(cats);

  // Giao dịch mẫu: [tháng, [ngày, tiền, danh mục, ghi chú]]
  // (Tháng hiện tại cố ý để Ăn uống VƯỢT hạn mức để demo cảnh báo)
  const m0 = currentMonthKey();
  const m1 = shiftMonth(m0, -1);
  const m2 = shiftMonth(m0, -2);
  const seed: [string, [number, number, string, string][]][] = [
    [
      m0,
      [
        [1, 15_000_000, "c-sal", "Lương tháng"],
        [2, -1_500_000, "c-food", "Ăn uống"],
        [3, -900_000, "c-food", "Ăn cùng bạn"],
        [5, -850_000, "c-food", "Đi ăn sinh nhật"],
        [6, -700_000, "c-fuel", "Đổ xăng"],
        [7, -350_000, "c-fun", "Xem phim"],
      ],
    ],
    [
      m1,
      [
        [3, -2_600_000, "c-food", "Ăn uống tháng"],
        [5, -900_000, "c-fuel", "Xăng xe"],
      ],
    ],
    [
      m2,
      [
        [5, -2_200_000, "c-food", "Ăn uống"],
        [12, -750_000, "c-fuel", "Xăng xe"],
      ],
    ],
  ];
  for (const [month, rows] of seed) {
    const list: Transaction[] = rows.map(
      ([day, amount, categoryId, note], i) => ({
        id: `seed-${month}-${i}`,
        amount,
        categoryId,
        note,
        date: `${month}-${String(day).padStart(2, "0")}`,
        createdAt: now + i,
      })
    );
    saveTransactions(month, list);
  }

  localStorage.setItem(SEED_FLAG_KEY, "1");
}
