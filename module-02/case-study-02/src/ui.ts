/**
 * ui.ts — Tầng GIAO DIỆN: vẽ (render) mọi thứ lên màn hình và xử lý
 * các nút bấm. Đây là file duy nhất can thiệp trực tiếp vào HTML.
 *
 * Nguyên tắc hoạt động rất đơn giản:
 *   Mỗi khi dữ liệu thay đổi → gọi refreshAll() → file này "vẽ lại
 *   toàn bộ trang" dựa trên dữ liệu mới nhất (đọc từ storage/category/transaction).
 *   Nhờ vậy Dashboard, lịch sử, cảnh báo... luôn đồng bộ với nhau.
 */

import type { Category, MonthSummary, TxType } from './types';
import * as storage from './storage';
import * as cats from './category';
import * as txs from './transaction';

/* ================================================================== */
/* CÁC HÀM NHỎ DÙNG CHUNG                                              */
/* ================================================================== */

/** Lấy phần tử HTML theo id (viết gọn hơn document.getElementById). */
function byId<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id) as T | null;
  if (!el) throw new Error(`Thiếu phần tử #${id} trong index.html`);
  return el;
}

/**
 * Chống lỗi XSS: nếu người dùng nhập chuỗi có ký tự đặc biệt như `<` `"`
 * và ta chèn thẳng vào HTML thì kẻ xấu có thể chèn mã. Hàm này thay
 * các ký tự đó bằng ký tự an toàn để chỉ hiển thị, không chạy.
 */
function esc(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (ch) => map[ch]);
}

/** Định dạng số tiền kiểu Việt Nam: 1200000 → "1.200.000 đ". */
function formatVND(n: number): string {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(n) + ' đ';
}

/** "2026-08" → "Tháng 8 năm 2026" (nhãn của Month Picker). */
function monthLabel(month: string): string {
  return `Tháng ${Number(month.slice(5, 7))} năm ${month.slice(0, 4)}`;
}

/** Giới hạn phần trăm hiển thị ở 1000% để thanh progress không tràn màn hình. */
function clampPercent(p: number): number {
  return Math.min(p, 1000);
}

/** Tháng đang xem (đọc từ localStorage). */
function selectedMonth(): string {
  return storage.loadSelectedMonth();
}

/** Bộ đếm thời gian của toast — khai báo ngoài để có thể hủy toast cũ. */
let toastTimer: number | undefined;

/** Hiện thông báo nổi nhỏ góc dưới màn hình, tự ẩn sau ~3 giây. */
function toast(message: string, kind: 'success' | 'error' = 'success'): void {
  const el = byId<HTMLDivElement>('toast');
  el.textContent = message;
  el.className = `toast ${kind}`; // CSS tô màu xanh/đỏ theo kind
  el.hidden = false;
  window.clearTimeout(toastTimer); // hủy hẹn giờ cũ nếu có
  toastTimer = window.setTimeout(() => {
    el.hidden = true;
  }, 2800);
}

/* ================================================================== */
/* ĐIỀU HƯỚNG: tab + month picker                                      */
/* ================================================================== */

/** Chuyển tab (Dashboard / Giao dịch / Danh mục / Báo cáo). */
function switchTab(tab: string): void {
  // Cập nhật nút đang "sáng"
  document.querySelectorAll('.tab').forEach((b) => {
    const btn = b as HTMLElement;
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  // Hiện/ẩn từng phần nội dung
  document.querySelectorAll('.section').forEach((s) => {
    const section = s as HTMLElement;
    section.hidden = section.dataset.section !== tab;
  });
}

/** Chuyển tháng bên cạnh (nút ‹ ›) rồi vẽ lại toàn bộ (F04-1). */
function changeMonth(delta: number): void {
  storage.saveSelectedMonth(storage.shiftMonth(selectedMonth(), delta));
  refreshAll();
}

/* ================================================================== */
/* VẼ TOÀN BỘ TRANG                                                  */
/* ================================================================== */

/** Vẽ lại mọi thứ theo dữ liệu hiện tại. Gọi sau MỖI thao tác thêm/sửa/xóa. */
function refreshAll(): void {
  renderMonthPicker(); // nhãn tháng trên header
  renderDashboard(); // số dư, thu/chi, ngân sách, cảnh báo
  renderTxFormCategories(); // dropdown danh mục trong form giao dịch
  renderTxList(); // bảng lịch sử giao dịch
  renderCategories(); // danh sách danh mục
  renderSummary(); // bảng tổng hợp các tháng
}

/** Vẽ nhãn "Tháng 8 năm 2026" trên header. */
function renderMonthPicker(): void {
  byId('monthLabel').textContent = monthLabel(selectedMonth());
}

/* ================================================================== */
/* DASHBOARD (F01)                                                     */
/* ================================================================== */

function renderDashboard(): void {
  const month = selectedMonth();
  const monthTxs = txs.listTransactions(month);
  const totals = txs.totTx(monthTxs);
  const allTxs = storage.loadAllTransactions();
  const categories = cats.getCategories();

  // ---- 1) Số dư hiện tại (F01-1): tổng thu trừ tổng chi của MỌI tháng ----
  const balance = txs.balanceOf(allTxs);
  const balanceEl = byId('balanceAmount');
  balanceEl.textContent = formatVND(balance);
  balanceEl.className = balance >= 0 ? 'card-value up' : 'card-value down'; // xanh/đỏ
  byId('balanceCard').classList.toggle('negative', balance < 0);
  byId('balanceCaption').textContent = `${allTxs.length} giao dịch đã ghi nhận (mọi tháng)`;

  // ---- 2) Tổng thu / tổng chi của tháng đang chọn (F01-2) ----
  byId('statIncome').textContent = `+${formatVND(totals.income)}`;
  byId('statExpense').textContent = `−${formatVND(totals.expense)}`;

  // ---- 3) Thanh ngân sách tổng: đã chi so với tổng hạn mức (F01-3) ----
  const sumLimit = cats.totalLimit(categories);
  const stateEl = byId('budgetState');
  const bar = byId('budgetBar');
  if (sumLimit <= 0) {
    // Chưa danh mục nào đặt hạn mức → không tính được ngân sách
    stateEl.textContent = 'Chưa đặt hạn mức';
    stateEl.className = 'budget-state muted';
    bar.style.width = '0%';
    byId('budgetText').textContent = 'Đặt hạn mức cho từng danh mục (tab Danh mục) để theo dõi ngân sách.';
  } else {
    const percent = (totals.expense / sumLimit) * 100;
    const over = percent > 100; // vượt ngân sách tổng?
    stateEl.textContent = over ? `Vượt ${Math.round(percent - 100)}%` : 'Đạt hạn mức';
    stateEl.className = over ? 'budget-state over' : 'budget-state ok';
    bar.style.width = `${clampPercent(percent)}%`;
    bar.classList.toggle('over', over); // đổi màu thanh sang đỏ khi vượt
    byId('budgetText').textContent =
      `Đã chi ${formatVND(totals.expense)} / ${formatVND(sumLimit)} (${Math.round(percent)}%)`;
  }

  // ---- 4) Hộp cảnh báo: các danh mục vượt hạn mức (F05-1) ----
  const overSpends = cats.categorySpends(categories, monthTxs).filter((s) => s.overLimit);
  const alertCard = byId('alertCard');
  alertCard.hidden = overSpends.length === 0; // không có danh mục vượt → ẩn hộp
  let alertHtml = '';
  for (const s of overSpends) {
    const overBy = Math.round(s.percent - 100);
    alertHtml +=
      `<li>` +
      `<strong>${esc(s.category.name)}</strong> ` +
      `<span>đã chi <b class="down">${formatVND(s.spent)}</b> / hạn mức ${formatVND(s.category.limit ?? 0)}</span> ` +
      `<b class="tag over">vượt ${overBy}%</b></li>`;
  }
  byId('alertList').innerHTML = alertHtml;
}

/* ================================================================== */
/* GIAO DỊCH (F03)                                                     */
/* ================================================================== */

/** Đổ danh sách danh mục vào dropdown của form thêm giao dịch. */
function renderTxFormCategories(): void {
  const select = byId<HTMLSelectElement>('txCategory');
  const previous = select.value; // giữ lựa chọn cũ của người dùng
  let options = '<option value="" disabled selected>— Chọn danh mục —</option>';
  for (const c of cats.getCategories()) {
    options += `<option value="${c.id}">${esc(c.name)}</option>`;
  }
  select.innerHTML = options;
  if (previous) select.value = previous;
}

/** Vẽ bảng lịch sử giao dịch của tháng đang chọn (F03-3, F03-4). */
function renderTxList(): void {
  const list = txs.listTransactions(selectedMonth());
  byId('txCount').textContent = String(list.length);
  byId('txEmpty').hidden = list.length > 0; // ẩn dòng "chưa có giao dịch" nếu có dữ liệu

  // Chuẩn bị map id → danh mục để tra tên nhanh khi vẽ
  const catMap = new Map<string, Category>();
  for (const c of cats.getCategories()) catMap.set(c.id, c);

  let rows = '';
  for (const t of list) {
    const cat = catMap.get(t.categoryId);
    const catName = cat ? esc(cat.name) : '<span class="muted">(danh mục đã xóa)</span>';
    const cls = t.amount >= 0 ? 'up' : 'down'; // xanh cho thu, đỏ cho chi
    const sign = t.amount >= 0 ? '+' : '−';
    // Tách "2026-08-15" ra từng phần để hiển thị 15/08/2026
    const [y, m, d] = t.date.split('-');
    rows +=
      `<tr>` +
      `<td class="muted">${d}/${m}/${y}</td>` +
      `<td>${catName}</td>` +
      `<td class="note-cell">${t.note ? esc(t.note) : '<span class="muted">—</span>'}</td>` +
      `<td class="num ${cls}">${sign}${formatVND(Math.abs(t.amount))}</td>` +
      `<td class="num"><button type="button" class="btn danger sm" ` +
      `data-del-tx="${t.id}" title="Xóa giao dịch">✕</button></td>` +
      `</tr>`;
  }
  byId('txList').innerHTML = rows;
  bindTxButtons(); // gắn sự kiện cho các nút ✕ vừa tạo
}

/** Gắn sự kiện xóa cho từng nút ✕ trong bảng lịch sử. */
function bindTxButtons(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>('#txList button[data-del-tx]');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.delTx ?? '';
      const month = selectedMonth();
      const tx = txs.listTransactions(month).find((t) => t.id === id);
      if (!tx) return;
      const kind = tx.amount >= 0 ? 'thu' : 'chi';
      // Hỏi lại trước khi xóa (tránh bấm nhầm)
      if (window.confirm(`Xóa giao dịch ${kind} ${formatVND(Math.abs(tx.amount))} ngày ${tx.date}?`)) {
        const result = txs.deleteTransaction(id, month);
        if (result.ok) {
          toast('Đã xóa giao dịch ✓');
          refreshAll(); // vẽ lại: Dashboard, danh mục... đều cập nhật theo
        } else {
          toast(result.error ?? 'Không thể xóa giao dịch.', 'error');
        }
      }
    });
  });
}

/* ================================================================== */
/* DANH MỤC (F02)                                                      */
/* ================================================================== */

/** Vẽ danh sách danh mục: hạn mức + đã chi + % + nút Sửa/Xóa (F02-5). */
function renderCategories(): void {
  const list = cats.getCategories();
  const monthTxs = txs.listTransactions(selectedMonth());
  const spends = cats.categorySpends(list, monthTxs);

  byId('catEmpty').hidden = list.length > 0;

  let html = '';
  for (const s of spends) {
    const { category, spent, percent, overLimit } = s;
    const limitText = category.limit === null ? 'Không giới hạn' : formatVND(category.limit);
    const overTag = overLimit ? `<b class="tag over">vượt ${Math.round(percent - 100)}%</b>` : '';
    let bar = '';
    if (category.limit !== null && category.limit > 0) {
      bar =
        `<div class="progress mini"><div class="progress-fill ${overLimit ? 'over' : ''}" ` +
        `style="width:${clampPercent(percent)}%"></div></div>`;
    }
    html +=
      `<li class="cat-row">` +
      `<div class="cat-info">` +
      `<div class="cat-name-line"><strong>${esc(category.name)}</strong>${overTag}</div>` +
      `<div class="cat-meta">Đã chi <b class="${overLimit ? 'down' : ''}">${formatVND(spent)}</b> ` +
      `/ Hạn mức ${limitText}</div>` +
      `${bar}` +
      `</div>` +
      `<div class="cat-actions">` +
      `<button type="button" class="btn sm" data-edit-cat="${category.id}">Sửa</button>` +
      `<button type="button" class="btn danger sm" data-del-cat="${category.id}">Xóa</button>` +
      `</div>` +
      `</li>`;
  }
  byId('catList').innerHTML = html;
  bindCategoryButtons(); // gắn sự kiện cho các nút Sửa/Xóa vừa tạo
}

/** Gắn sự kiện cho nút Sửa / Xóa của từng danh mục. */
function bindCategoryButtons(): void {
  // ---- Nút "Sửa": điền dữ liệu danh mục lên form để sửa (F02-2) ----
  const editButtons = document.querySelectorAll<HTMLButtonElement>('#catList button[data-edit-cat]');
  editButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = cats.getCategory(btn.dataset.editCat ?? '');
      if (!cat) return;
      // Ghi id danh mục đang sửa vào ô ẩn trong form (nhớ điểm để submit biết là SỬA)
      (byId('editingCatId') as HTMLInputElement).value = cat.id;
      (byId('catName') as HTMLInputElement).value = cat.name;
      (byId('catLimit') as HTMLInputElement).value = cat.limit === null ? '' : String(cat.limit);
      (byId('catSubmitBtn') as HTMLButtonElement).textContent = 'Cập nhật';
      (byId('catFormTitle') as HTMLElement).textContent = 'Sửa danh mục';
      (byId('catCancelBtn') as HTMLButtonElement).hidden = false;
      switchTab('categories'); // chuyển sang tab Danh mục
      (byId('catName') as HTMLInputElement).focus();
    });
  });

  // ---- Nút "Xóa": xóa có hỏi lại + kiểm tra ràng buộc (F02-3) ----
  const delButtons = document.querySelectorAll<HTMLButtonElement>('#catList button[data-del-cat]');
  delButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = cats.getCategory(btn.dataset.delCat ?? '');
      if (!cat) return;
      if (!window.confirm(`Xóa danh mục "${cat.name}"?`)) return;
      const result = cats.deleteCategory(cat.id);
      if (result.ok) {
        toast('Đã xóa danh mục ✓');
        resetCatForm(); // nếu form đang ở chế độ sửa thì về chế độ thêm
        refreshAll();
      } else {
        toast(result.error ?? 'Không thể xóa danh mục.', 'error');
      }
    });
  });
}

/* ================================================================== */
/* BÁO CÁO TỔNG HỢP CÁC THÁNG (F05-2)                                  */
/* ================================================================== */

function renderSummary(): void {
  // Lấy ra các tháng đang có dữ liệu (seed sẵn 3 tháng) rồi tính thu/chi từng tháng
  const months = storage.allTxMonths();
  const summaries: MonthSummary[] = [];
  for (const m of months) {
    const t = txs.totTx(storage.loadTransactions(m));
    summaries.push({ key: m, income: t.income, expense: t.expense });
  }

  // Tìm tháng chi nhiều nhất để đổi sang chiều dài thanh so sánh
  let maxExpense = 0;
  for (const s of summaries) maxExpense = Math.max(maxExpense, s.expense);

  byId('summaryEmpty').hidden = summaries.length > 0;

  let rows = '';
  for (const s of summaries) {
    const diff = s.income - s.expense;
    const diffCls = diff >= 0 ? 'up' : 'down';
    const diffSign = diff >= 0 ? '+' : '−';
    const width = maxExpense > 0 ? Math.round((s.expense / maxExpense) * 100) : 0;
    // Đánh dấu dòng "đang xem" trên Month Picker để dễ đối chiếu
    const active = s.key === selectedMonth() ? ' class="active-month"' : '';
    const currentTag = s.key === selectedMonth() ? ' <span class="tag current">đang xem</span>' : '';
    rows +=
      `<tr${active}>` +
      `<td><strong>${monthLabel(s.key)}</strong>${currentTag}</td>` +
      `<td class="num up">+${formatVND(s.income)}</td>` +
      `<td class="num down">−${formatVND(s.expense)}</td>` +
      `<td class="num ${diffCls}">${diffSign}${formatVND(Math.abs(diff))}</td>` +
      `<td class="bar-col"><div class="progress mini">` +
      `<div class="progress-fill" style="width:${width}%"></div></div></td>` +
      `</tr>`;
  }
  byId('summaryBody').innerHTML = rows;
}

/* ================================================================== */
/* XỬ LÝ CÁC FORM (GIAO DỊCH & DANH MỤC)                              */
/* ================================================================== */

/** Lưu giao dịch từ form (F03-1, F03-2). */
function onTxSubmit(e: SubmitEvent): void {
  e.preventDefault(); // chặn trình duyệt tự tải lại trang khi submit

  const amountInput = byId<HTMLInputElement>('txAmount');
  const categorySelect = byId<HTMLSelectElement>('txCategory');
  const noteInput = byId<HTMLInputElement>('txNote');
  const dateInput = byId<HTMLInputElement>('txDate');
  const typeRadio = document.querySelector<HTMLInputElement>('input[name="txType"]:checked');

  // Nếu người dùng chưa chọn ngày thì lấy ngày hôm nay
  if (!dateInput.value) dateInput.value = storage.todayKey();

  const result = txs.addTransaction({
    amount: amountInput.valueAsNumber,
    type: (typeRadio?.value as TxType) ?? 'expense',
    categoryId: categorySelect.value,
    note: noteInput.value,
    date: dateInput.value,
  });

  if (!result.ok) {
    toast(result.error ?? 'Không thể lưu giao dịch.', 'error'); // hiện lời nhắn lỗi
    return;
  }

  // Thành công → xóa trắng 2 ô tiền và ghi chú, giữ lại danh mục & ngày đã chọn
  amountInput.value = '';
  noteInput.value = '';
  toast('Đã lưu giao dịch ✓');
  refreshAll();
}

/** Đưa form danh mục về trạng thái "thêm mới". */
function resetCatForm(): void {
  (byId('editingCatId') as HTMLInputElement).value = ''; // không còn id đang sửa
  (byId('catForm') as HTMLFormElement).reset();
  (byId('catSubmitBtn') as HTMLButtonElement).textContent = 'Lưu danh mục';
  (byId('catFormTitle') as HTMLElement).textContent = 'Thêm danh mục';
  (byId('catCancelBtn') as HTMLButtonElement).hidden = true;
}

/** Lưu danh mục từ form: thêm mới hoặc cập nhật (tùy ô ẩn editingCatId). */
function onCatSubmit(e: SubmitEvent): void {
  e.preventDefault();

  const nameInput = byId<HTMLInputElement>('catName');
  const limitInput = byId<HTMLInputElement>('catLimit');
  const editingId = (byId('editingCatId') as HTMLInputElement).value;

  // editingId rỗng → thêm mới; ngược lại → sửa danh mục đó (F02-2)
  const result =
    editingId === ''
      ? cats.addCategory(nameInput.value, limitInput.value)
      : cats.updateCategory(editingId, nameInput.value, limitInput.value);

  if (!result.ok) {
    toast(result.error ?? 'Không thể lưu danh mục.', 'error');
    return;
  }

  toast(editingId === '' ? 'Đã thêm danh mục ✓' : 'Đã cập nhật danh mục ✓');
  resetCatForm();
  refreshAll();
}

/* ================================================================== */
/* KHỞI TẠO GIAO DIỆN (được app.ts gọi)                               */
/* ================================================================== */

/** Gắn toàn bộ sự kiện cố định (nút, form) rồi vẽ trang lần đầu. */
export function initUi(): void {
  // Month Picker (F04-1)
  byId('prevMonthBtn').addEventListener('click', () => changeMonth(-1));
  byId('nextMonthBtn').addEventListener('click', () => changeMonth(1));

  // Tabs điều hướng
  document.querySelectorAll<HTMLElement>('.tab').forEach((tab) => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab ?? ''));
  });

  // Form giao dịch và form danh mục
  byId('txForm').addEventListener('submit', onTxSubmit);
  byId('catForm').addEventListener('submit', onCatSubmit);
  byId('catCancelBtn').addEventListener('click', resetCatForm);

  // Vẽ trang lần đầu tiên
  refreshAll();
}