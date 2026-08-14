import { Category, Transaction } from "./types";

const CATEGORIES_KEY = "ewallet:categories";
const SELECTED_MONTH_KEY = "ewallet:selectedMonth";
const TX_PREFIX = "ewallet:tx:";
const SEED_FLAG_KEY = "ewallet:seeded-v2";

/** 8 -> "08" */
function twoDigits(n: number): string {
  if (n < 10) return "0" + n;
  return String(n);
}

/** Id duy nhất: thời điểm tạo + số ngẫu nhiên */
export function newId(): string {
  return String(Date.now()) + "-" + Math.floor(Math.random() * 100000);
}

/** Tháng hiện tại, dạng "YYYY-MM" */
export function currentMonth(): string {
  const d = new Date();
  return d.getFullYear() + "-" + twoDigits(d.getMonth() + 1);
}

/** Ngày hôm nay, dạng "YYYY-MM-DD" */
export function todayKey(): string {
  const d = new Date();
  return currentMonth() + "-" + twoDigits(d.getDate());
}

/** Cộng/trừ tháng: shiftMonth("2026-08", -1) -> "2026-07" */
export function shiftMonth(month: string, delta: number): string {
  let year = Number(month.slice(0, 4));
  let m = Number(month.slice(5, 7)) + delta;
  if (m < 1) {
    m += 12;
    year -= 1;
  }
  if (m > 12) {
    m -= 12;
    year += 1;
  }
  return year + "-" + twoDigits(m);
}

export function loadCategories(): Category[] {
  return JSON.parse(localStorage.getItem(CATEGORIES_KEY) || "[]");
}

export function saveCategories(list: Category[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(list));
}

export function loadTransactions(month: string): Transaction[] {
  return JSON.parse(localStorage.getItem(TX_PREFIX + month) || "[]");
}

export function saveTransactions(month: string, list: Transaction[]): void {
  localStorage.setItem(TX_PREFIX + month, JSON.stringify(list));
}

/** Các tháng đang có dữ liệu */
export function allTxMonths(): string[] {
  const months: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(TX_PREFIX)) {
      months.push(key.slice(TX_PREFIX.length));
    }
  }
  return months;
}

export function loadSelectedMonth(): string {
  const m = localStorage.getItem(SELECTED_MONTH_KEY);
  if (m === null) return currentMonth();
  return m;
}

export function saveSelectedMonth(month: string): void {
  localStorage.setItem(SELECTED_MONTH_KEY, month);
}

/** Lần đầu mở app: tạo danh mục & giao dịch mẫu */
export function seedIfEmpty(): void {
  if (localStorage.getItem(SEED_FLAG_KEY) !== null) return;
  const now = Date.now();

  const cats: Category[] = [
    { id: "c-food", name: "Ăn uống", limit: 3000000, createdAt: now },
    { id: "c-fuel", name: "Xăng xe", limit: 800000, createdAt: now },
    { id: "c-shop", name: "Mua sắm", limit: 2000000, createdAt: now },
    { id: "c-fun", name: "Giải trí", limit: 800000, createdAt: now },
    { id: "c-bill", name: "Hóa đơn", limit: 1500000, createdAt: now },
    { id: "c-sal", name: "Lương", limit: null, createdAt: now },
  ];
  saveCategories(cats);

  const m0 = currentMonth();
  const m1 = shiftMonth(m0, -1);
  const m2 = shiftMonth(m0, -2);
  const seed = [
    {
      month: m0,
      rows: [
        { day: 1, amount: 15000000, categoryId: "c-sal", note: "Lương tháng" },
        { day: 2, amount: -1500000, categoryId: "c-food", note: "Ăn uống" },
        { day: 3, amount: -900000, categoryId: "c-food", note: "Ăn cùng bạn" },
        {
          day: 5,
          amount: -850000,
          categoryId: "c-food",
          note: "Đi ăn sinh nhật",
        },
        { day: 6, amount: -700000, categoryId: "c-fuel", note: "Đổ xăng" },
        { day: 7, amount: -350000, categoryId: "c-fun", note: "Xem phim" },
      ],
    },
    {
      month: m1,
      rows: [
        {
          day: 3,
          amount: -2600000,
          categoryId: "c-food",
          note: "Ăn uống tháng",
        },
        { day: 5, amount: -900000, categoryId: "c-fuel", note: "Xăng xe" },
      ],
    },
    {
      month: m2,
      rows: [
        { day: 5, amount: -2200000, categoryId: "c-food", note: "Ăn uống" },
        { day: 12, amount: -750000, categoryId: "c-fuel", note: "Xăng xe" },
      ],
    },
  ];

  for (const s of seed) {
    const list: Transaction[] = [];
    let i = 0;
    for (const r of s.rows) {
      list.push({
        id: "seed-" + s.month + "-" + i,
        amount: r.amount,
        categoryId: r.categoryId,
        note: r.note,
        date: s.month + "-" + twoDigits(r.day),
        createdAt: now + i,
      });
      i++;
    }
    saveTransactions(s.month, list);
  }

  localStorage.setItem(SEED_FLAG_KEY, "1");
}