import * as storage from "./storage";
import * as category from "./category";
import * as transaction from "./transaction";

/** Lấy phần tử HTML theo id */
function getEl(id: string): HTMLElement {
  return document.getElementById(id) as HTMLElement;
}

function getInput(id: string): HTMLInputElement {
  return document.getElementById(id) as HTMLInputElement;
}

function getSelect(id: string): HTMLSelectElement {
  return document.getElementById(id) as HTMLSelectElement;
}

function getForm(id: string): HTMLFormElement {
  return document.getElementById(id) as HTMLFormElement;
}

/** 1200000 -> "1200000 đ" */
function formatVND(n: number): string {
  return String(n) + " đ";
}

/** "2026-08" -> "Tháng 8 năm 2026" */
function monthLabel(month: string): string {
  return "Tháng " + Number(month.slice(5, 7)) + " năm " + month.slice(0, 4);
}

/** Tháng đang xem trên Month Picker */
function selectedMonth(): string {
  return storage.loadSelectedMonth();
}

/** Chuyển tab (Dashboard / Giao dịch / Danh mục / Báo cáo) */
function switchTab(tab: string): void {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(function (btn) {
    if (btn.getAttribute("data-tab") === tab) btn.classList.add("active");
    else btn.classList.remove("active");
  });
  const sections = document.querySelectorAll(".section");
  sections.forEach(function (section) {
    if (section.getAttribute("data-section") === tab) {
      section.removeAttribute("hidden");
    } else {
      section.setAttribute("hidden", "");
    }
  });
}

/** Chuyển tháng bằng nút ‹ › rồi vẽ lại trang */
function changeMonth(delta: number): void {
  storage.saveSelectedMonth(storage.shiftMonth(selectedMonth(), delta));
  refreshAll();
}

/** Vẽ lại toàn bộ trang (gọi sau mỗi thay đổi dữ liệu) */
function refreshAll(): void {
  renderMonthPicker();
  renderBalance();
  renderBudget();
  renderAlerts();
  renderTxForm();
  renderTxList();
  renderCategories();
  renderSummary();
}

/** Nhãn tháng trên header */
function renderMonthPicker(): void {
  getEl("monthLabel").textContent = monthLabel(selectedMonth());
}

/** 3 thẻ đầu: số dư + tổng thu/chi của tháng đang xem */
function renderBalance(): void {
  const month = selectedMonth();
  const totals = transaction.getTotals(transaction.listTransactions(month));
  const balance = transaction.getBalance();

  const balanceEl = getEl("balanceAmount");
  balanceEl.textContent = formatVND(balance);
  if (balance >= 0) balanceEl.className = "card-value up";
  else balanceEl.className = "card-value down";
  const balanceCard = getEl("balanceCard");
  if (balance < 0) balanceCard.classList.add("negative");
  else balanceCard.classList.remove("negative");
  getEl("balanceCaption").textContent =
    transaction.countTransactions() + " giao dịch đã ghi nhận (mọi tháng)";

  getEl("statIncome").textContent = "+" + formatVND(totals.income);
  getEl("statExpense").textContent = "-" + formatVND(totals.expense);
}

/** Thẻ "Ngân sách tháng": đã chi bao nhiêu so với tổng hạn mức */
function renderBudget(): void {
  const monthTx = transaction.listTransactions(selectedMonth());
  const expense = transaction.getTotals(monthTx).expense;
  const sumLimit = category.totalLimit();
  const stateEl = getEl("budgetState");
  const bar = getEl("budgetBar");
  const textEl = getEl("budgetText");

  if (sumLimit <= 0) {
    stateEl.textContent = "Chưa đặt hạn mức";
    stateEl.className = "budget-state muted";
    bar.style.width = "0%";
    textEl.textContent =
      "Đặt hạn mức cho từng danh mục (tab Danh mục) để theo dõi ngân sách.";
    return;
  }

  const percent = (expense / sumLimit) * 100;
  if (percent > 100) {
    stateEl.textContent = "Vượt " + Math.round(percent - 100) + "%";
    stateEl.className = "budget-state over";
  } else {
    stateEl.textContent = "Đạt hạn mức";
    stateEl.className = "budget-state ok";
  }
  bar.style.width = Math.min(percent, 1000) + "%";
  if (percent > 100) bar.classList.add("over");
  else bar.classList.remove("over");
  textEl.textContent =
    "Đã chi " +
    formatVND(expense) +
    " / " +
    formatVND(sumLimit) +
    " (" +
    Math.round(percent) +
    "%)";
}

/** Cảnh báo các danh mục vượt hạn mức trong tháng đang xem */
function renderAlerts(): void {
  const spends = category.getSpends(selectedMonth());
  const overSpends = spends.filter(function (s) {
    return s.overLimit;
  });

  const alertCard = getEl("alertCard");
  alertCard.hidden = overSpends.length === 0;

  let html = "";
  for (const s of overSpends) {
    const overBy = Math.round(s.percent - 100);
    const limitText = s.category.limit === null ? 0 : s.category.limit;
    html += `
      <li>
        <strong>${s.category.name}</strong>
        <span>đã chi <b class="down">${formatVND(s.spent)}</b>
        / hạn mức ${formatVND(limitText)}</span>
        <b class="tag over">vượt ${overBy}%</b>
      </li>`;
  }
  getEl("alertList").innerHTML = html;
}

/** Đổ danh mục vào dropdown của form thêm giao dịch */
function renderTxForm(): void {
  const select = getSelect("txCategory");
  const previous = select.value;
  let options = '<option value="" disabled selected>— Chọn danh mục —</option>';
  for (const c of category.getCategories()) {
    options += `<option value="${c.id}">${c.name}</option>`;
  }
  select.innerHTML = options;
  if (previous !== "") select.value = previous;
}

/** Bảng lịch sử giao dịch của tháng đang xem */
function renderTxList(): void {
  const list = transaction.listTransactions(selectedMonth());
  getEl("txCount").textContent = String(list.length);
  getEl("txEmpty").hidden = list.length > 0;

  let rows = "";
  for (const t of list) {
    const cat = category.getCategory(t.categoryId);
    const catName =
      cat === null ? '<span class="muted">(danh mục đã xóa)</span>' : cat.name;
    const cls = t.amount >= 0 ? "up" : "down";
    const sign = t.amount >= 0 ? "+" : "-";
    const note = t.note === "" ? '<span class="muted">—</span>' : t.note;
    const parts = t.date.split("-");
    rows += `
      <tr>
        <td class="muted">${parts[2]}/${parts[1]}/${parts[0]}</td>
        <td>${catName}</td>
        <td class="note-cell">${note}</td>
        <td class="num ${cls}">${sign}${formatVND(Math.abs(t.amount))}</td>
        <td class="num">
          <button type="button" class="btn danger sm" data-del-tx="${
            t.id
          }" title="Xóa giao dịch">✕</button>
        </td>
      </tr>`;
  }
  getEl("txList").innerHTML = rows;
  bindTxButtons();
}

/** Gắn sự kiện xóa cho từng nút ✕ */
function bindTxButtons(): void {
  const buttons = document.querySelectorAll("[data-del-tx]");
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id = btn.getAttribute("data-del-tx") || "";
      const tx = transaction.findTransaction(id);
      if (tx === null) return;
      const kind = tx.amount >= 0 ? "thu" : "chi";
      const message =
        "Xóa giao dịch " +
        kind +
        " " +
        formatVND(Math.abs(tx.amount)) +
        " ngày " +
        tx.date +
        "?";
      if (window.confirm(message)) {
        const error = transaction.deleteTransaction(id, selectedMonth());
        if (error === null) {
          refreshAll();
        } else {
          alert(error);
        }
      }
    });
  });
}

/** Danh sách danh mục: hạn mức + đã chi + % + nút Sửa/Xóa */
function renderCategories(): void {
  const spends = category.getSpends(selectedMonth());
  getEl("catEmpty").hidden = spends.length > 0;

  let html = "";
  for (const s of spends) {
    const limitText =
      s.category.limit === null
        ? "Không giới hạn"
        : formatVND(s.category.limit);
    const overTag = s.overLimit
      ? `<b class="tag over">vượt ${Math.round(s.percent - 100)}%</b>`
      : "";
    let bar = "";
    if (s.category.limit !== null && s.category.limit > 0) {
      bar = `<div class="progress mini"><div class="progress-fill ${
        s.overLimit ? "over" : ""
      }" style="width:${Math.min(s.percent, 1000)}%"></div></div>`;
    }
    html += `
      <li class="cat-row">
        <div class="cat-info">
          <div class="cat-name-line">
            <strong>${s.category.name}</strong>${overTag}
          </div>
          <div class="cat-meta">
            Đã chi <b class="${s.overLimit ? "down" : ""}">${formatVND(
      s.spent
    )}</b>
            / Hạn mức ${limitText}
          </div>
          ${bar}
        </div>
        <div class="cat-actions">
          <button type="button" class="btn sm" data-edit-cat="${
            s.category.id
          }">Sửa</button>
          <button type="button" class="btn danger sm" data-del-cat="${
            s.category.id
          }">Xóa</button>
        </div>
      </li>`;
  }
  getEl("catList").innerHTML = html;
  bindCategoryButtons();
}

/** Gắn sự kiện cho nút Sửa / Xóa của từng danh mục */
function bindCategoryButtons(): void {
  const editButtons = document.querySelectorAll("[data-edit-cat]");
  editButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const cat = category.getCategory(btn.getAttribute("data-edit-cat") || "");
      if (cat === null) return;
      getInput("editingCatId").value = cat.id;
      getInput("catName").value = cat.name;
      getInput("catLimit").value = cat.limit === null ? "" : String(cat.limit);
      getEl("catSubmitBtn").textContent = "Cập nhật";
      getEl("catFormTitle").textContent = "Sửa danh mục";
      getEl("catCancelBtn").hidden = false;
      switchTab("categories");
      getInput("catName").focus();
    });
  });

  const delButtons = document.querySelectorAll("[data-del-cat]");
  delButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const cat = category.getCategory(btn.getAttribute("data-del-cat") || "");
      if (cat === null) return;
      if (window.confirm('Xóa danh mục "' + cat.name + '"?')) {
        const error = category.deleteCategory(cat.id);
        if (error === null) {
          resetCatForm();
          refreshAll();
        } else {
          alert(error);
        }
      }
    });
  });
}

/** Bảng tổng hợp thu/chi từng tháng */
function renderSummary(): void {
  const months = storage.allTxMonths();

  let maxExpense = 0;
  for (const m of months) {
    const totals = transaction.getTotals(storage.loadTransactions(m));
    if (totals.expense > maxExpense) maxExpense = totals.expense;
  }

  getEl("summaryEmpty").hidden = months.length > 0;

  let rows = "";
  for (let i = months.length - 1; i >= 0; i--) {
    const m = months[i];
    const totals = transaction.getTotals(storage.loadTransactions(m));
    const diff = totals.income - totals.expense;
    const width =
      maxExpense > 0 ? Math.round((totals.expense / maxExpense) * 100) : 0;
    const active = m === selectedMonth() ? ' class="active-month"' : "";
    rows += `
      <tr${active}>
        <td><strong>${monthLabel(m)}</strong></td>
        <td class="num up">+${formatVND(totals.income)}</td>
        <td class="num down">-${formatVND(totals.expense)}</td>
        <td class="num ${diff >= 0 ? "up" : "down"}">${
      diff >= 0 ? "+" : "−"
    }${formatVND(Math.abs(diff))}</td>
        <td class="bar-col"><div class="progress mini"><div class="progress-fill" style="width:${width}%"></div></div></td>
      </tr>`;
  }
  getEl("summaryBody").innerHTML = rows;
}

/** Lưu giao dịch từ form */
function onTxSubmit(e: SubmitEvent): void {
  e.preventDefault();
  const amountInput = getInput("txAmount");
  const categorySelect = getSelect("txCategory");
  const noteInput = getInput("txNote");
  const dateInput = getInput("txDate");
  const typeInput = document.querySelector(
    'input[name="txType"]:checked'
  ) as HTMLInputElement | null;

  if (dateInput.value === "") dateInput.value = storage.todayKey();

  const error = transaction.addTransaction(
    amountInput.valueAsNumber,
    typeInput === null ? "expense" : typeInput.value,
    categorySelect.value,
    noteInput.value,
    dateInput.value
  );

  if (error !== null) {
    alert(error);
    return;
  }

  amountInput.value = "";
  noteInput.value = "";
  refreshAll();
}

/** Đưa form danh mục về trạng thái "thêm mới" */
function resetCatForm(): void {
  getInput("editingCatId").value = "";
  getForm("catForm").reset();
  getEl("catSubmitBtn").textContent = "Lưu danh mục";
  getEl("catFormTitle").textContent = "Thêm danh mục";
  getEl("catCancelBtn").hidden = true;
}

/** Lưu danh mục: thêm mới hoặc cập nhật (tùy ô ẩn editingCatId) */
function onCatSubmit(e: SubmitEvent): void {
  e.preventDefault();
  const editingId = getInput("editingCatId").value;
  const name = getInput("catName").value;
  const limit = getInput("catLimit").value;

  const error =
    editingId === ""
      ? category.addCategory(name, limit)
      : category.updateCategory(editingId, name, limit);

  if (error !== null) {
    alert(error);
    return;
  }

  resetCatForm();
  refreshAll();
}

/** Gắn toàn bộ sự kiện rồi vẽ trang lần đầu */
export function initUi(): void {
  getEl("prevMonthBtn").addEventListener("click", function () {
    changeMonth(-1);
  });
  getEl("nextMonthBtn").addEventListener("click", function () {
    changeMonth(1);
  });

  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      switchTab(tab.getAttribute("data-tab") || "");
    });
  });

  getForm("txForm").addEventListener("submit", onTxSubmit);
  getForm("catForm").addEventListener("submit", onCatSubmit);
  getEl("catCancelBtn").addEventListener("click", resetCatForm);

  refreshAll();
}