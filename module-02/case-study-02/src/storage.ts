/**
 * storage.ts — File chuyên đọc / ghi DỮ LIỆU vào localStorage
 * (một "kho lưu trữ" mà trình duyệt tự nhớ, kể cả khi đóng tab).
 *
 * QUY ƯỚC ĐẶT KHÓA (key) trong localStorage:
 *   ewallet:categories     → danh sách danh mục (dùng chung mọi tháng)
 *   ewallet:tx:2026-08     → giao dịch của riêng tháng 8/2026
 *   ewallet:tx:2026-07     → giao dịch của riêng tháng 7/2026
 *   ...                    → mỗi tháng có một khóa riêng (yêu cầu F04-3)
 *   ewallet:selectedMonth  → tháng đang xem trên Month Picker
 *   ewallet:seeded         → cờ đánh dấu "đã tạo dữ liệu mẫu hay chưa"
 *
 * Lưu ý: localStorage chỉ lưu được chuỗi (string), nên dữ liệu phức tạp
 * như mảng đối tượng phải chuyển thành JSON bằng JSON.stringify /
 * JSON.parse. Mọi hàm đọc đều kiểm tra dữ liệu cẩn thận để nếu dữ liệu
 * bị hỏng thì chỉ trả về mảng rỗng, không làm crash ứng dụng.
 */

import type { Category, Transaction } from './types';

const CATEGORIES_KEY = 'ewallet:categories';
const SELECTED_MONTH_KEY = 'ewallet:selectedMonth';
const SEED_FLAG_KEY = 'ewallet:seeded';
const TX_PREFIX = 'ewallet:tx:';

/* ================================================================== */
/* 1. CÁC HÀM TIỆN ÍCH VỀ THỜI GIAN                                    */
/* ================================================================== */

/** Chuyển một đối tượng Date thành khóa tháng dạng "YYYY-MM". */
function monthKeyOf(date: Date): string {
  const year = date.getFullYear();
  // getMonth() đếm từ 0 (tháng 1 = 0), nên phải +1.
  // padStart(2, "0") ép số thành đúng 2 chữ số, ví dụ: 8 → "08".
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/** Khóa tháng hiện tại theo đồng hồ máy người dùng. */
export function currentMonthKey(): string {
  return monthKeyOf(new Date());
}

/** Ngày hôm nay dạng "YYYY-MM-DD" (dùng làm ngày mặc định của form). */
export function todayKey(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  return `${monthKeyOf(d)}-${day}`;
}

/**
 * Cộng/trừ delta tháng vào một khóa tháng.
 * Ví dụ: shiftMonth("2026-08", -1) → "2026-07"
 * (Dùng cho 2 nút ‹ › trên Month Picker.)
 */
export function shiftMonth(month: string, delta: number): string {
  const year = Number(month.slice(0, 4));
  const monthIndex = Number(month.slice(5, 7)); // getMonth() tính từ 0 nên -1... +1 bù lại
  const d = new Date(year, monthIndex - 1 + delta, 1);
  return monthKeyOf(d);
}

/* ================================================================== */
/* 2. HÀM ĐỌC DỮ LIỆU AN TOÀN                                          */
/* ================================================================== */

/**
 * Đọc một khóa trong localStorage rồi parse ra mảng.
 * - Nếu chưa có gì hoặc dữ liệu hỏng (JSON sai cú pháp) → trả về [].
 * - Nếu JSON có nhưng không phải mảng → cũng trả về [].
 */
function readArray(key: string): unknown[] {
  const raw = localStorage.getItem(key); // raw có thể là null nếu khóa chưa tồn tại
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return []; // JSON hỏng → coi như chưa có dữ liệu
  }
}

/**
 * Kiểm tra một phần tử (kiểu unknown) có đủ các trường của Transaction không.
 * Phần tử không hợp lệ sẽ bị bỏ qua, giúp ứng dụng không bao giờ lỗi
 * dù localStorage có dữ liệu cũ/thiếu trường.
 */
function isOkTransaction(item: unknown): item is Transaction {
  const t = item as Partial<Transaction>;
  return (
    typeof t.id === 'string' &&
    typeof t.amount === 'number' &&
    Number.isFinite(t.amount) &&
    typeof t.categoryId === 'string' &&
    typeof t.date === 'string'
  );
}

/** Tương tự, kiểm tra phần tử có đúng là Category không. */
function isOkCategory(item: unknown): item is Category {
  const c = item as Partial<Category>;
  return (
    typeof c.id === 'string' &&
    typeof c.name === 'string' &&
    (typeof c.limit === 'number' || c.limit === null) &&
    typeof c.createdAt === 'number'
  );
}

/* ================================================================== */
/* 3. DANH MỤC (CATEGORIES)                                            */
/* ================================================================== */

/** Đọc toàn bộ danh mục từ localStorage, lọc bỏ phần tử sai kiểu. */
export function loadCategories(): Category[] {
  return readArray(CATEGORIES_KEY).filter(isOkCategory);
}

/** Ghi toàn bộ danh mục xuống localStorage (ghi đè). */
export function saveCategories(list: Category[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(list));
}

/* ================================================================== */
/* 4. GIAO DỊCH (TRANSACTIONS) — mỗi tháng một khóa riêng (F04-3)      */
/* ================================================================== */

/** Ghép khóa của một tháng: "2026-08" → "ewallet:tx:2026-08". */
function txKey(month: string): string {
  return `${TX_PREFIX}${month}`;
}

/** Đọc giao dịch của một tháng cụ thể. */
export function loadTransactions(month: string): Transaction[] {
  return readArray(txKey(month)).filter(isOkTransaction);
}

/** Ghi giao dịch của một tháng cụ thể (ghi đè toàn bộ tháng đó). */
export function saveTransactions(month: string, list: Transaction[]): void {
  localStorage.setItem(txKey(month), JSON.stringify(list));
}

/** Liệt kê các tháng đang có dữ liệu, sắp xếp tháng mới lên trước. */
export function allTxMonths(): string[] {
  const months: string[] = [];
  // Duyệt qua từng khóa trong localStorage bằng vòng lặp
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(TX_PREFIX)) {
      months.push(key.slice(TX_PREFIX.length)); // bỏ phần "ewallet:tx:" đi
    }
  }
  // Khóa dạng "YYYY-MM" so sánh được theo thứ tự chữ cái = thứ tự thời gian
  months.sort((a, b) => (a < b ? 1 : -1));
  return months;
}

/** Gộp giao dịch của TẤT CẢ các tháng (dùng để tính số dư tổng). */
export function loadAllTransactions(): Transaction[] {
  const result: Transaction[] = [];
  for (const month of allTxMonths()) {
    for (const tx of loadTransactions(month)) {
      result.push(tx);
    }
  }
  return result;
}

/* ================================================================== */
/* 5. THÁNG ĐANG XEM TRÊN MONTH PICKER                                 */
/* ================================================================== */

/** Đọc tháng đang xem; nếu chưa lưu hoặc giá trị sai thì chọn tháng hiện tại. */
export function loadSelectedMonth(): string {
  const m = localStorage.getItem(SELECTED_MONTH_KEY);
  // Chấp nhận giá trị chỉ khi đúng dạng "YYYY-MM"
  if (m && /^\d{4}-\d{2}$/.test(m)) {
    return m;
  }
  return currentMonthKey();
}

/** Ghi nhớ tháng đang xem (tải lại trang vẫn giữ nguyên). */
export function saveSelectedMonth(month: string): void {
  localStorage.setItem(SELECTED_MONTH_KEY, month);
}

/* ================================================================== */
/* 6. DỮ LIỆU MẪU (SEED) — chạy 1 lần khi lần đầu mở app (NFR-7)      */
/* ================================================================== */

/**
 * Tạo dữ liệu mẫu nếu đây là lần đầu chạy (chưa có cờ ewallet:seeded).
 * Seed 1 lần duy nhất để không bao giờ đè lên dữ liệu của người dùng.
 */
export function seedIfEmpty(): void {
  if (localStorage.getItem(SEED_FLAG_KEY)) return;

  const now = Date.now();

  // ---- 1) Tạo 6 danh mục mẫu kèm hạn mức riêng từng loại (F02-4) ----
  const categories: Category[] = [
    { id: 'c-food',   name: 'Ăn uống',   limit: 3_000_000, createdAt: now },
    { id: 'c-fuel',   name: 'Xăng xe',   limit: 800_000,    createdAt: now },
    { id: 'c-shop',   name: 'Mua sắm',   limit: 2_000_000, createdAt: now },
    { id: 'c-fun',    name: 'Giải trí',  limit: 800_000,    createdAt: now },
    { id: 'c-bill',   name: 'Hóa đơn',   limit: 1_500_000, createdAt: now },
    { id: 'c-salary', name: 'Lương',     limit: null,       createdAt: now }, // Lương không đặt hạn mức
  ];
  saveCategories(categories);

  // ---- 2) Tạo giao dịch mẫu cho 3 tháng: hiện tại, trước 1, trước 2 ----
  // (Tháng hiện tại cố ý để VƯỢT hạn mức Ăn uống + Xăng xe để demo cảnh báo)
  const seedData = [
    {
      month: currentMonthKey(),
      rows: [
        { day: 1, amount: 15_000_000, categoryId: 'c-salary', note: 'Lương tháng' },
        { day: 1, amount: -1_300_000, categoryId: 'c-bill',   note: 'Tiền điện, nước, internet' },
        { day: 2, amount: -1_200_000, categoryId: 'c-food',   note: 'Ăn uống cuối tuần' },
        { day: 2, amount: -900_000,   categoryId: 'c-food',   note: 'Ăn hàng cùng bạn bè' },
        { day: 3, amount: -700_000,   categoryId: 'c-fuel',   note: 'Đổ xăng' },
        { day: 4, amount: -2_400_000, categoryId: 'c-shop',   note: 'Mua quần áo mới' },
        { day: 5, amount: -850_000,   categoryId: 'c-food',   note: 'Đi ăn sinh nhật' },
        { day: 6, amount: -350_000,   categoryId: 'c-fun',    note: 'Xem phim' },
        { day: 7, amount: -250_000,   categoryId: 'c-fuel',   note: 'Đổ xăng' },
        { day: 8, amount: -450_000,   categoryId: 'c-food',   note: 'Ăn trưa văn phòng' },
        { day: 9, amount: 2_000_000,  categoryId: 'c-salary', note: 'Thu nhập freelance' },
      ],
    },
    {
      month: shiftMonth(currentMonthKey(), -1), // tháng trước
      rows: [
        { day: 2,  amount: 15_000_000, categoryId: 'c-salary', note: 'Lương tháng' },
        { day: 3,  amount: -2_600_000, categoryId: 'c-food',   note: 'Ăn uống cả tháng' },
        { day: 5,  amount: -900_000,   categoryId: 'c-fuel',   note: 'Xăng xe' },
        { day: 7,  amount: -1_800_000, categoryId: 'c-shop',   note: 'Đồ gia dụng' },
        { day: 10, amount: -600_000,   categoryId: 'c-fun',    note: 'Giải trí' },
        { day: 15, amount: -1_400_000, categoryId: 'c-bill',   note: 'Hóa đơn' },
      ],
    },
    {
      month: shiftMonth(currentMonthKey(), -2), // 2 tháng trước
      rows: [
        { day: 2,  amount: 14_000_000, categoryId: 'c-salary', note: 'Lương tháng' },
        { day: 5,  amount: -2_200_000, categoryId: 'c-food',   note: 'Ăn uống' },
        { day: 8,  amount: -750_000,   categoryId: 'c-fuel',   note: 'Xăng xe' },
        { day: 12, amount: -1_500_000, categoryId: 'c-shop',   note: 'Mua sắm' },
        { day: 18, amount: -500_000,   categoryId: 'c-fun',    note: 'Giải trí' },
        { day: 20, amount: -1_550_000, categoryId: 'c-bill',   note: 'Hóa đơn' },
        { day: 25, amount: -2_800_000, categoryId: 'c-food',   note: 'Tiệc cuối tháng' },
      ],
    },
  ];

  // Chuyển từng dòng mẫu thành Transaction thật rồi lưu đúng tháng của nó
  for (const block of seedData) {
    const list: Transaction[] = [];
    let count = 0; // dùng để tạo id và thứ tự createdAt
    for (const row of block.rows) {
      // Số ngày tối đa của tháng (tháng 2 có 28/29 ngày) để không tạo ngày 31 không tồn tại
      const maxDay = new Date(Number(block.month.slice(0, 4)), Number(block.month.slice(5, 7)), 0).getDate();
      const day = Math.min(row.day, maxDay);
      list.push({
        id: `seed-${block.month}-${count}`,
        amount: row.amount,
        categoryId: row.categoryId,
        note: row.note,
        date: `${block.month}-${String(day).padStart(2, '0')}`,
        createdAt: now + count,
      });
      count++;
    }
    saveTransactions(block.month, list);
  }

  // Đặt cờ để lần sau không seed lại
  localStorage.setItem(SEED_FLAG_KEY, '1');
}