import { Category, Transaction, Totals, CatSpend } from "./types";

const CATEGORIES_KEY = "ewallet:categories";
const TRANSACTIONS_KEY = "ewallet:transactions";
const SELECTED_MONTH_KEY = "ewallet:selectedMonth";
const SEED_FLAG_KEY = "ewallet:seeded-v2";

/** 8 -> "08" */
function twoDigits(n: number): string {
  if (n < 10) return "0" + n;
  return String(n);
}

/** Kiểm tra định dạng ngày "YYYY-MM-DD" */
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
  return year >= 2000;
}

export class EWallet {
  categories: Category[] = [];
  transactions: Transaction[] = [];

  constructor() {
    this.load();
  }

  /** Đọc dữ liệu từ localStorage vào 2 mảng */
  load(): void {
    this.categories = JSON.parse(localStorage.getItem(CATEGORIES_KEY) || "[]");
    this.transactions = JSON.parse(
      localStorage.getItem(TRANSACTIONS_KEY) || "[]"
    );
  }

  /** Ghi 2 mảng lên localStorage, gọi sau mỗi thay đổi */
  save(): void {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(this.categories));
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(this.transactions));
  }

  /** Id duy nhất: thời điểm tạo + số ngẫu nhiên */
  newId(): string {
    return String(Date.now()) + "-" + Math.floor(Math.random() * 100000);
  }

  /** Tháng hiện tại, dạng "YYYY-MM" */
  currentMonth(): string {
    const d = new Date();
    return d.getFullYear() + "-" + twoDigits(d.getMonth() + 1);
  }

  /** Ngày hôm nay, dạng "YYYY-MM-DD" */
  todayKey(): string {
    const d = new Date();
    return this.currentMonth() + "-" + twoDigits(d.getDate());
  }

  /** Cộng/trừ tháng: shiftMonth("2026-08", -1) -> "2026-07" */
  shiftMonth(month: string, delta: number): string {
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

  /** Tháng đang xem trên Month Picker (lưu trong localStorage) */
  loadSelectedMonth(): string {
    const m = localStorage.getItem(SELECTED_MONTH_KEY);
    if (m === null) return this.currentMonth();
    return m;
  }

  saveSelectedMonth(month: string): void {
    localStorage.setItem(SELECTED_MONTH_KEY, month);
  }

  /** Toàn bộ danh mục, hiển thị theo thứ tự tạo */
  getCategories(): Category[] {
    return this.categories;
  }

  /** Tìm danh mục theo id, không có -> null */
  getCategory(id: string): Category | null {
    for (const c of this.categories) {
      if (c.id === id) return c;
    }
    return null;
  }

  /** Thêm danh mục; trả về lỗi hoặc null nếu thành công */
  addCategory(name: string, limitRaw: string): string | null {
    const trimmed = name.trim();
    const limitText = limitRaw.trim();

    if (trimmed === "") return "Tên danh mục không được để trống.";
    if (trimmed.length > 40) return "Tên danh mục tối đa 40 ký tự.";
    for (const c of this.categories) {
      if (c.name.toLowerCase() === trimmed.toLowerCase()) {
        return `Danh mục "${trimmed}" đã tồn tại.`;
      }
    }

    let limit: number | null = null;
    if (limitText !== "") {
      limit = Number(limitText);
      if (isNaN(limit) || limit < 0 || limit % 1 !== 0) {
        return "Hạn mức phải là số nguyên ≥ 0 (để trống = không giới hạn).";
      }
    }

    this.categories.push({
      id: this.newId(),
      name: trimmed,
      limit,
      createdAt: Date.now(),
    });
    this.save();
    return null;
  }

  /** Sửa tên / hạn mức của một danh mục */
  updateCategory(id: string, name: string, limitRaw: string): string | null {
    const trimmed = name.trim();
    const limitText = limitRaw.trim();

    const target = this.getCategory(id);
    if (target === null) return "Không tìm thấy danh mục.";

    if (trimmed === "") return "Tên danh mục không được để trống.";
    if (trimmed.length > 40) return "Tên danh mục tối đa 40 ký tự.";
    for (const c of this.categories) {
      if (c.name.toLowerCase() === trimmed.toLowerCase() && c.id !== id) {
        return `Danh mục "${trimmed}" đã tồn tại.`;
      }
    }

    let limit: number | null = null;
    if (limitText !== "") {
      limit = Number(limitText);
      if (isNaN(limit) || limit < 0 || limit % 1 !== 0) {
        return "Hạn mức phải là số nguyên ≥ 0 (để trống = không giới hạn).";
      }
    }

    const index = this.categories.indexOf(target);
    this.categories[index] = {
      id: target.id,
      name: trimmed,
      limit,
      createdAt: target.createdAt,
    };
    this.save();
    return null;
  }

  /** Xóa danh mục; không cho xóa nếu còn giao dịch thuộc nó */
  deleteCategory(id: string): string | null {
    const target = this.getCategory(id);
    if (target === null) return "Không tìm thấy danh mục.";

    let count = 0;
    for (const t of this.transactions) {
      if (t.categoryId === id) count++;
    }
    if (count > 0) {
      return `Không thể xóa "${target.name}" vì vẫn còn ${count} giao dịch thuộc danh mục này.`;
    }

    const index = this.categories.indexOf(target);
    this.categories.splice(index, 1);
    this.save();
    return null;
  }

  /** Giao dịch của tháng "YYYY-MM", mới nhất lên đầu */
  getTransactions(month: string): Transaction[] {
    const result: Transaction[] = [];
    for (let i = this.transactions.length - 1; i >= 0; i--) {
      const t = this.transactions[i];
      if (t.date.slice(0, 7) === month) result.push(t);
    }
    return result;
  }

  /** Tìm giao dịch theo id, không có -> null */
  getTransaction(id: string): Transaction | null {
    for (const t of this.transactions) {
      if (t.id === id) return t;
    }
    return null;
  }

  /** Thêm giao dịch; trả về lỗi hoặc null nếu thành công */
  addTransaction(
    amount: number,
    type: string,
    categoryId: string,
    note: string,
    date: string
  ): string | null {
    if (amount <= 0 || amount % 1 !== 0)
      return "Số tiền phải là số nguyên dương.";
    if (categoryId === "") return "Vui lòng chọn danh mục cho giao dịch.";
    if (this.getCategory(categoryId) === null) return "Danh mục không tồn tại.";
    if (!isValidDate(date)) return "Ngày giao dịch không hợp lệ.";

    this.transactions.push({
      id: this.newId(),
      amount: type === "income" ? amount : -amount,
      categoryId,
      note: note.trim().slice(0, 120),
      date,
      createdAt: Date.now(),
    });

    this.save();
    return null;
  }

  /** Xóa giao dịch theo id trong tháng đang xem */
  deleteTransaction(id: string, month: string): string | null {
    const txs = this.getTransactions(month);
    for (const t of txs) {
      if (t.id === id) {
        const index = this.transactions.indexOf(t);
        this.transactions.splice(index, 1);
        this.save();
        return null;
      }
    }
    return "Không tìm thấy giao dịch.";
  }

  /** Tổng thu và tổng chi của một danh sách giao dịch */
  getTotals(txs: Transaction[]): Totals {
    let income = 0;
    let expense = 0;
    for (const t of txs) {
      if (t.amount >= 0) income += t.amount;
      else expense += -t.amount;
    }
    return { income, expense };
  }

  /** Số dư hiện tại = tổng thu − tổng chi (mọi tháng) */
  getBalance(): number {
    let total = 0;
    for (const t of this.transactions) total += t.amount;
    return total;
  }

  /** Tổng hạn mức của tất cả danh mục */
  totalLimit(): number {
    let sum = 0;
    for (const c of this.categories) {
      if (c.limit !== null) sum += c.limit;
    }
    return sum;
  }

  /** Chi tiêu từng danh mục trong tháng: đã chi, %, có vượt không */
  getSpends(month: string): CatSpend[] {
    const txs = this.getTransactions(month);
    const result: CatSpend[] = [];
    for (const c of this.categories) {
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

  /** Lần đầu mở app: tạo danh mục và giao dịch mẫu */
  seedIfEmpty(): void {
    if (localStorage.getItem(SEED_FLAG_KEY) !== null) return;
    const now = Date.now();

    this.categories = [
      { id: "c-food", name: "Ăn uống", limit: 3000000, createdAt: now },
      { id: "c-fuel", name: "Xăng xe", limit: 800000, createdAt: now },
      { id: "c-shop", name: "Mua sắm", limit: 2000000, createdAt: now },
      { id: "c-fun", name: "Giải trí", limit: 800000, createdAt: now },
      { id: "c-bill", name: "Hóa đơn", limit: 1500000, createdAt: now },
      { id: "c-sal", name: "Lương", limit: null, createdAt: now },
    ];

    const m0 = this.currentMonth();
    const m1 = this.shiftMonth(m0, -1);
    const m2 = this.shiftMonth(m0, -2);
    const seed = [
      {
        month: m0,
        rows: [
          {
            day: 1,
            amount: 15000000,
            categoryId: "c-sal",
            note: "Lương tháng",
          },
          { day: 2, amount: -1500000, categoryId: "c-food", note: "Ăn uống" },
          {
            day: 3,
            amount: -900000,
            categoryId: "c-food",
            note: "Ăn cùng bạn",
          },
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

    this.transactions = [];
    let index = 0;
    for (const s of seed) {
      for (const r of s.rows) {
        index++;
        this.transactions.push({
          id: "seed-" + index,
          amount: r.amount,
          categoryId: r.categoryId,
          note: r.note,
          date: s.month + "-" + twoDigits(r.day),
          createdAt: now + index,
        });
      }
    }

    this.save();
    localStorage.setItem(SEED_FLAG_KEY, "1");
  }
}