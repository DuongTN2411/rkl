// ui.ts — Tầng GIAO DIỆN: vẽ mọi thứ lên màn hình và xử lý nút bấm.
// Mỗi khi dữ liệu thay đổi → refreshAll() vẽ lại toàn bộ trang từ dữ liệu mới.

import type { Category } from "./types";
import * as storage from "./storage";
import * as cats from "./category";
import * as txs from "./transaction";

/* ============================================================
   Hàm dùng chung
   ============================================================ */

/** Lấy phần tử HTML theo id (nếu thiếu trong index.html thì báo lỗi). */
function byId(id: string): any {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Thiếu phần tử #${id} trong index.html`);
  return el;
}

/** Chống lỗi XSS: thay ký tự đặc biệt (`<` `"`...) bằng ký tự an toàn. */
function esc(text: string): string {
  const map: any = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (ch) => map[ch]);
}

/** Định dạng tiền kiểu Việt Nam: 1200000 → "1.200.000 đ". */
function formatVND(n: number): string {
  return (
    new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(n) +
    " đ"
  );
}

/** "2026-08" → "Tháng 8 năm 2026" (nhãn Month Picker). */
function monthLabel(month: string): string {
  return `Tháng ${Number(month.slice(5, 7))} năm ${month.slice(0, 4)}`;
}

/** Tháng đang xem (đọc từ localStorage). */
function selectedMonth(): string {
  return storage.loadSelectedMonth();
}

/** Hiện thông báo nổi nhỏ, tự ẩn sau ~3 giây. */
let toastTimer: any;
function toast(message: string, kind: string = "success"): void {
  const el = byId("toast");
  el.textContent = message;
  el.className = `toast ${kind}`;
  el.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    el.hidden = true;
  }, 2800);
}

/* ============================================================
   Điều hướng: Month Picker + tabs
   ============================================================ */

/** Chuyển tab (Dashboard / Giao dịch / Danh mục / Báo cáo). */
function switchTab(tab: string): void {
  document.querySelectorAll(".tab").forEach((b) => {
    const btn = b as HTMLElement;
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });
  document.querySelectorAll(".section").forEach((s) => {
    const section = s as HTMLElement;
    section.hidden = section.dataset.section !== tab;
  });
}

/** Chuyển tháng bằng nút ‹ › rồi vẽ lại toàn bộ. */
function changeMonth(delta: number): void {
  storage.saveSelectedMonth(storage.shiftMonth(selectedMonth(), delta));
  refreshAll();
}

/* ============================================================
   Vẽ toàn bộ trang
   ============================================================ */

function refreshAll(): void {
  renderMonthPicker();
  renderDashboard();
  renderTxFormCategories();
  renderTxList();
  renderCategories();
  renderSummary();
}

/** Nhãn "Tháng 8 năm 2026" trên header. */
function renderMonthPicker(): void {
  byId("monthLabel").textContent = monthLabel(selectedMonth());
}

/* ============================================================
   DASHBOARD
   ============================================================ */

function renderDashboard(): void {
  const month = selectedMonth();
  const monthTxs = txs.listTransactions(month);
  const totals = txs.totTx(monthTxs);
  const allTxs = storage.loadAllTransactions();
  const categories = cats.getCategories();

  // 1) Số dư hiện tại: tổng thu − tổng chi của MỌI tháng
  const balance = txs.balanceOf(allTxs);
  const balanceEl = byId("balanceAmount");
  balanceEl.textContent = formatVND(balance);
  balanceEl.className = balance >= 0 ? "card-value up" : "card-value down";
  byId("balanceCard").classList.toggle("negative", balance < 0);
  byId(
    "balanceCaption"
  ).textContent = `${allTxs.length} giao dịch đã ghi nhận (mọi tháng)`;

  // 2) Tổng thu / tổng chi của tháng đang xem
  byId("statIncome").textContent = `+${formatVND(totals.income)}`;
  byId("statExpense").textContent = `-${formatVND(totals.expense)}`;

  // 3) Ngân sách: đã chi so với tổng hạn mức các danh mục
  const sumLimit = cats.totalLimit(categories);
  const stateEl = byId("budgetState");
  const bar = byId("budgetBar");
  if (sumLimit <= 0) {
    stateEl.textContent = "Chưa đặt hạn mức";
    stateEl.className = "budget-state muted";
    bar.style.width = "0%";
    byId("budgetText").textContent =
      "Đặt hạn mức cho từng danh mục (tab Danh mục) để theo dõi ngân sách.";
  } else {
    const percent = (totals.expense / sumLimit) * 100;
    const over = percent > 100;
    stateEl.textContent = over
      ? `Vượt ${Math.round(percent - 100)}%`
      : "Đạt hạn mức";
    stateEl.className = over ? "budget-state over" : "budget-state ok";
    bar.style.width = `${Math.min(percent, 1000)}%`;
    bar.classList.toggle("over", over);
    byId("budgetText").textContent = `Đã chi ${formatVND(
      totals.expense
    )} / ${formatVND(sumLimit)} (${Math.round(percent)}%)`;
  }

  // 4) Cảnh báo các danh mục vượt hạn mức
  const overSpends = cats
    .categorySpends(categories, monthTxs)
    .filter((s) => s.overLimit);
  const alertCard = byId("alertCard");
  alertCard.hidden = overSpends.length === 0;
  let alertHtml = "";
  for (const s of overSpends) {
    const overBy = Math.round(s.percent - 100);
    alertHtml +=
      `<li>` +
      `<strong>${esc(s.category.name)}</strong> ` +
      `<span>đã chi <b class="down">${formatVND(
        s.spent
      )}</b> / hạn mức ${formatVND(s.category.limit ?? 0)}</span> ` +
      `<b class="tag over">vượt ${overBy}%</b></li>`;
  }
  byId("alertList").innerHTML = alertHtml;
}

/* ============================================================
   GIAO DỊCH
   ============================================================ */

/** Đổ danh mục vào dropdown của form thêm giao dịch. */
function renderTxFormCategories(): void {
  const select = byId("txCategory");
  const previous = select.value;
  let options = '<option value="" disabled selected>— Chọn danh mục —</option>';
  for (const c of cats.getCategories()) {
    options += `<option value="${c.id}">${esc(c.name)}</option>`;
  }
  select.innerHTML = options;
  if (previous) select.value = previous;
}

/** Vẽ bảng lịch sử giao dịch của tháng đang xem. */
function renderTxList(): void {
  const list = txs.listTransactions(selectedMonth());
  byId("txCount").textContent = String(list.length);
  byId("txEmpty").hidden = list.length > 0;

  // Map id → danh mục để tra tên nhanh khi vẽ
  const catMap = new Map<string, Category>();
  for (const c of cats.getCategories()) catMap.set(c.id, c);

  let rows = "";
  for (const t of list) {
    const cat = catMap.get(t.categoryId);
    const catName = cat
      ? esc(cat.name)
      : '<span class="muted">(danh mục đã xóa)</span>';
    const cls = t.amount >= 0 ? "up" : "down";
    const sign = t.amount >= 0 ? "+" : "-";
    const [y, m, d] = t.date.split("-"); // "2026-08-15" → hiển thị 15/08/2026
    rows +=
      `<tr>` +
      `<td class="muted">${d}/${m}/${y}</td>` +
      `<td>${catName}</td>` +
      `<td class="note-cell">${
        t.note ? esc(t.note) : '<span class="muted">—</span>'
      }</td>` +
      `<td class="num ${cls}">${sign}${formatVND(Math.abs(t.amount))}</td>` +
      `<td class="num"><button type="button" class="btn danger sm" ` +
      `data-del-tx="${t.id}" title="Xóa giao dịch">✕</button></td>` +
      `</tr>`;
  }
  byId("txList").innerHTML = rows;
  bindTxButtons();
}

/** Gắn sự kiện xóa cho từng nút ✕ trong bảng lịch sử. */
function bindTxButtons(): void {
  const buttons: any = document.querySelectorAll("#txList button[data-del-tx]");
  buttons.forEach((btn: any) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.delTx ?? "";
      const month = selectedMonth();
      const tx = txs.listTransactions(month).find((t) => t.id === id);
      if (!tx) return;
      const kind = tx.amount >= 0 ? "thu" : "chi";
      // Hỏi lại trước khi xóa
      if (
        window.confirm(
          `Xóa giao dịch ${kind} ${formatVND(Math.abs(tx.amount))} ngày ${
            tx.date
          }?`
        )
      ) {
        const result = txs.deleteTransaction(id, month);
        if (result.ok) {
          toast("Đã xóa giao dịch ✓");
          refreshAll();
        } else {
          toast(result.error ?? "Không thể xóa giao dịch.", "error");
        }
      }
    });
  });
}

/* ============================================================
   DANH MỤC
   ============================================================ */

/** Vẽ danh sách danh mục: hạn mức + đã chi + % + nút Sửa/Xóa. */
function renderCategories(): void {
  const list = cats.getCategories();
  const monthTxs = txs.listTransactions(selectedMonth());
  const spends = cats.categorySpends(list, monthTxs);

  byId("catEmpty").hidden = list.length > 0;

  let html = "";
  for (const s of spends) {
    const { category, spent, percent, overLimit } = s;
    const limitText =
      category.limit === null ? "Không giới hạn" : formatVND(category.limit);
    const overTag = overLimit
      ? `<b class="tag over">vượt ${Math.round(percent - 100)}%</b>`
      : "";
    let bar = "";
    if (category.limit !== null && category.limit > 0) {
      bar =
        `<div class="progress mini"><div class="progress-fill ${
          overLimit ? "over" : ""
        }" ` + `style="width:${Math.min(percent, 1000)}%"></div></div>`;
    }
    html +=
      `<li class="cat-row">` +
      `<div class="cat-info">` +
      `<div class="cat-name-line"><strong>${esc(
        category.name
      )}</strong>${overTag}</div>` +
      `<div class="cat-meta">Đã chi <b class="${
        overLimit ? "down" : ""
      }">${formatVND(spent)}</b> ` +
      `/ Hạn mức ${limitText}</div>` +
      `${bar}` +
      `</div>` +
      `<div class="cat-actions">` +
      `<button type="button" class="btn sm" data-edit-cat="${category.id}">Sửa</button>` +
      `<button type="button" class="btn danger sm" data-del-cat="${category.id}">Xóa</button>` +
      `</div>` +
      `</li>`;
  }
  byId("catList").innerHTML = html;
  bindCategoryButtons();
}

/** Gắn sự kiện cho nút Sửa / Xóa của từng danh mục. */
function bindCategoryButtons(): void {
  // "Sửa": điền dữ liệu danh mục lên form
  const editButtons: any = document.querySelectorAll(
    "#catList button[data-edit-cat]"
  );
  editButtons.forEach((btn: any) => {
    btn.addEventListener("click", () => {
      const cat = cats.getCategory(btn.dataset.editCat);
      if (!cat) return;
      byId("editingCatId").value = cat.id;
      byId("catName").value = cat.name;
      byId("catLimit").value = cat.limit === null ? "" : String(cat.limit);
      byId("catSubmitBtn").textContent = "Cập nhật";
      byId("catFormTitle").textContent = "Sửa danh mục";
      byId("catCancelBtn").hidden = false;
      switchTab("categories");
      byId("catName").focus();
    });
  });

  // "Xóa": hỏi lại + kiểm tra ràng buộc
  const delButtons: any = document.querySelectorAll(
    "#catList button[data-del-cat]"
  );
  delButtons.forEach((btn: any) => {
    btn.addEventListener("click", () => {
      const cat = cats.getCategory(btn.dataset.delCat);
      if (!cat) return;
      if (!window.confirm(`Xóa danh mục "${cat.name}"?`)) return;
      const result = cats.deleteCategory(cat.id);
      if (result.ok) {
        toast("Đã xóa danh mục ✓");
        resetCatForm();
        refreshAll();
      } else {
        toast(result.error ?? "Không thể xóa danh mục.", "error");
      }
    });
  });
}

/* ============================================================
   BÁO CÁO CÁC THÁNG
   ============================================================ */

function renderSummary(): void {
  const months = storage.allTxMonths();
  const summaries: { key: string; income: number; expense: number }[] = [];
  for (const m of months) {
    const t = txs.totTx(storage.loadTransactions(m));
    summaries.push({ key: m, income: t.income, expense: t.expense });
  }

  // Tháng chi nhiều nhất để đổi ra chiều dài thanh so sánh
  let maxExpense = 0;
  for (const s of summaries) maxExpense = Math.max(maxExpense, s.expense);

  byId("summaryEmpty").hidden = summaries.length > 0;

  let rows = "";
  for (const s of summaries) {
    const diff = s.income - s.expense;
    const diffCls = diff >= 0 ? "up" : "down";
    const diffSign = diff >= 0 ? "+" : "−";
    const width =
      maxExpense > 0 ? Math.round((s.expense / maxExpense) * 100) : 0;
    // Tô màu dòng "đang xem" trên Month Picker để dễ đối chiếu
    const active = s.key === selectedMonth() ? ' class="active-month"' : "";
    rows +=
      `<tr${active}>` +
      `<td><strong>${monthLabel(s.key)}</strong></td>` +
      `<td class="num up">+${formatVND(s.income)}</td>` +
      `<td class="num down">-${formatVND(s.expense)}</td>` +
      `<td class="num ${diffCls}">${diffSign}${formatVND(
        Math.abs(diff)
      )}</td>` +
      `<td class="bar-col"><div class="progress mini">` +
      `<div class="progress-fill" style="width:${width}%"></div></div></td>` +
      `</tr>`;
  }
  byId("summaryBody").innerHTML = rows;
}

/* ============================================================
   Xử lý form (giao dịch & danh mục)
   ============================================================ */

/** Lưu giao dịch từ form. */
function onTxSubmit(e: SubmitEvent): void {
  e.preventDefault();
  const amountInput = byId("txAmount");
  const categorySelect = byId("txCategory");
  const noteInput = byId("txNote");
  const dateInput = byId("txDate");
  const typeRadio: any = document.querySelector('input[name="txType"]:checked');

  if (!dateInput.value) dateInput.value = storage.todayKey();

  const result = txs.addTransaction({
    amount: amountInput.valueAsNumber,
    type: typeRadio ? typeRadio.value : "expense",
    categoryId: categorySelect.value,
    note: noteInput.value,
    date: dateInput.value,
  });

  if (!result.ok) {
    toast(result.error ?? "Không thể lưu giao dịch.", "error");
    return;
  }

  // Xóa trắng 2 ô tiền & ghi chú, giữ danh mục & ngày đã chọn
  amountInput.value = "";
  noteInput.value = "";
  toast("Đã lưu giao dịch ✓");
  refreshAll();
}

/** Đưa form danh mục về trạng thái "thêm mới". */
function resetCatForm(): void {
  byId("editingCatId").value = "";
  byId("catForm").reset();
  byId("catSubmitBtn").textContent = "Lưu danh mục";
  byId("catFormTitle").textContent = "Thêm danh mục";
  byId("catCancelBtn").hidden = true;
}

/** Lưu danh mục: thêm mới hoặc cập nhật (tùy ô ẩn editingCatId). */
function onCatSubmit(e: SubmitEvent): void {
  e.preventDefault();
  const nameInput = byId("catName");
  const limitInput = byId("catLimit");
  const editingId = byId("editingCatId").value;

  const result =
    editingId === ""
      ? cats.addCategory(nameInput.value, limitInput.value)
      : cats.updateCategory(editingId, nameInput.value, limitInput.value);

  if (!result.ok) {
    toast(result.error ?? "Không thể lưu danh mục.", "error");
    return;
  }

  toast(editingId === "" ? "Đã thêm danh mục ✓" : "Đã cập nhật danh mục ✓");
  resetCatForm();
  refreshAll();
}

/* ============================================================
   Khởi tạo (app.ts gọi)
   ============================================================ */

/** Gắn toàn bộ sự kiện cố định rồi vẽ trang lần đầu. */
export function initUi(): void {
  byId("prevMonthBtn").addEventListener("click", () => changeMonth(-1));
  byId("nextMonthBtn").addEventListener("click", () => changeMonth(1));

  // Tabs điều hướng
  const tabs: any = document.querySelectorAll(".tab");
  tabs.forEach((tab: any) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  byId("txForm").addEventListener("submit", onTxSubmit);
  byId("catForm").addEventListener("submit", onCatSubmit);
  byId("catCancelBtn").addEventListener("click", resetCatForm);

  refreshAll();
}
