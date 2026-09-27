"use strict";

const ICON_PATHS = {
  cross: '<path d="M12 3v18M3 12h18" />',
  menu: '<path d="M4 6h16M4 12h16M4 18h16" />',
  x: '<path d="m6 6 12 12M18 6 6 18" />',
  "layout-dashboard": '<rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />',
  "calendar-days": '<rect x="3" y="4.5" width="18" height="17" rx="2" /><path d="M16 2.5v4M8 2.5v4M3 9.5h18M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" />',
  stethoscope: '<path d="M6 3v5a6 6 0 0 0 12 0V3M4 3h4M16 3h4M18 14v2a4 4 0 0 0 8 0v-1" transform="translate(-2)" /><circle cx="18" cy="13" r="2" />',
  "file-heart": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6" /><path d="M12 17s-3-1.8-3-4a1.8 1.8 0 0 1 3-1.1A1.8 1.8 0 0 1 15 13c0 2.2-3 4-3 4Z" />',
  activity: '<path d="M3 12h4l3-8 4 16 3-8h4" />',
  pill: '<path d="m10.5 20.5 9-9a4.24 4.24 0 0 0-6-6l-9 9a4.24 4.24 0 0 0 6 6Z" /><path d="m8 8 8 8" />',
  "map-pinned": '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /><path d="M8 2.8 4 4.5M16 2.8l4 1.7" />',
  "message-circle": '<path d="M20 11.5a8 8 0 0 1-8 8 8.4 8.4 0 0 1-3.6-.8L4 20l1.3-4.1A8 8 0 1 1 20 11.5Z" /><path d="M8 12h.01M12 12h.01M16 12h.01" />',
  sparkles: '<path d="m12 3-1.1 4.3a4 4 0 0 1-2.9 2.9L3.7 11.3 8 12.4a4 4 0 0 1 2.9 2.9L12 19.7l1.1-4.4a4 4 0 0 1 2.9-2.9l4.3-1.1-4.3-1.1a4 4 0 0 1-2.9-2.9L12 3ZM5 3v3M3.5 4.5h3M19 17v3M17.5 18.5h3" />',
  "arrow-up-right": '<path d="M7 17 17 7M7 7h10v10" />',
  "more-horizontal": '<circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" />',
  search: '<circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" />',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />',
  "chevron-down": '<path d="m6 9 6 6 6-6" />',
  "flask-conical": '<path d="M9 3h6M10 3v5l-5.5 9.4A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3.1L14 8V3M7.2 16h9.6" />',
  check: '<path d="m5 12 4 4L19 6" />',
  "check-circle": '<circle cx="12" cy="12" r="9" /><path d="m8 12 2.7 2.7L16.5 9" />',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7A2 2 0 0 1 22 16.9Z" />',
  plus: '<path d="M12 5v14M5 12h14" />',
  "heart-pulse": '<path d="M20.8 8.6c0 5.4-8.8 10.4-8.8 10.4S3.2 14 3.2 8.6A4.6 4.6 0 0 1 12 6.3a4.6 4.6 0 0 1 8.8 2.3Z" /><path d="M4 12h3l1.3-3 2.2 6 1.4-3H16" />',
  files: '<path d="M8 2h9a2 2 0 0 1 2 2v14M5 6h9a2 2 0 0 1 2 2v12H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" /><path d="M7 11h6M7 15h5" />',
  headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2v-5H4ZM20 14a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2v-5h2ZM18 20c-.8 1.2-2.2 2-4 2h-2" />',
  "calendar-check-2": '<rect x="3" y="4.5" width="18" height="17" rx="2" /><path d="M16 2.5v4M8 2.5v4M3 9.5h18M8 15l2 2 5-5" />',
  "clock-3": '<circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />',
  "calendar-plus-2": '<rect x="3" y="4.5" width="18" height="17" rx="2" /><path d="M16 2.5v4M8 2.5v4M3 9.5h18M12 13v6M9 16h6" />',
  "building-2": '<path d="M6 21V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17M3 21h18M9 6h1M14 6h1M9 10h1M14 10h1M9 14h1M14 14h1M11 21v-3h2v3" />',
  video: '<path d="m16 13 5 3V8l-5 3M3 6h13v12H3z" />',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />',
  "bell-ring": '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4M4 4 2.5 2.5M20 4l1.5-1.5" />',
  target: '<circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" />',
  "moon-star": '<path d="M20.5 14.3A8.5 8.5 0 0 1 9.7 3.5 8.5 8.5 0 1 0 20.5 14.3Z" /><path d="m18 3 .5 1.5L20 5l-1.5.5L18 7l-.5-1.5L16 5l1.5-.5L18 3Z" />',
  waves: '<path d="M2 9c2.7 0 2.7 2 5.3 2s2.7-2 5.4-2 2.7 2 5.3 2 2.7-2 5.4-2M2 15c2.7 0 2.7 2 5.3 2s2.7-2 5.4-2 2.7 2 5.3 2 2.7-2 5.4-2" />',
  droplets: '<path d="M12 2.5S5.5 9.2 5.5 14a6.5 6.5 0 0 0 13 0c0-4.8-6.5-11.5-6.5-11.5Z" /><path d="M9 15a3 3 0 0 0 3 3" />',
  brain: '<path d="M9.5 4.5A3.5 3.5 0 0 0 6 8v.5A3.5 3.5 0 0 0 4 15a3.5 3.5 0 0 0 4 4h1.5M14.5 4.5A3.5 3.5 0 0 1 18 8v.5A3.5 3.5 0 0 1 20 15a3.5 3.5 0 0 1-4 4h-1.5M9 4v16M15 4v16M5.5 11h3M15.5 13h3M8.5 16H11M13 8h3" />',
  baby: '<circle cx="12" cy="8" r="3.5" /><path d="M6 21v-2.5a6 6 0 0 1 12 0V21M9 3.5 7 2M15 3.5l2-1M4 13h2M18 13h2" />',
  "scan-face": '<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3M9 10h.01M15 10h.01M9 15c1.6 1.2 4.4 1.2 6 0" />',
  "map-pin": '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" />',
  navigation: '<path d="m3 11 18-8-8 18-2.5-7.5L3 11Z" /><path d="m10.5 13.5 4-4" />',
  "shield-check": '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" />',
  "badge-check": '<path d="m12 3 2.1 1.2 2.4-.1 1.1 2.1 2.1 1.1-.1 2.4L21 12l-1.2 2.1.1 2.4-2.1 1.1-1.1 2.1-2.4-.1L12 21l-2.1-1.2-2.4.1-1.1-2.1-2.1-1.1.1-2.4L3 12l1.2-2.1-.1-2.4 2.1-1.1 1.1-2.1 2.4.1L12 3Z" /><path d="m8.5 12 2.2 2.2 4.8-4.8" />'
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function renderIcons(scope = document) {
  $$(".icon[data-icon]", scope).forEach((icon) => {
    const path = ICON_PATHS[icon.dataset.icon];
    if (!path || icon.querySelector("svg")) return;
    icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
  });
}

renderIcons();

const toastRegion = $("#toastRegion");
const sidebar = $("#sidebar");
const sidebarScrim = $("#sidebarScrim");

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  const icon = document.createElement("span");
  icon.className = "toast-icon";
  icon.innerHTML = '<span class="icon" data-icon="check-circle"></span>';
  const copy = document.createElement("span");
  copy.textContent = message;
  toast.append(icon, copy);
  toastRegion.append(toast);
  renderIcons(toast);

  window.setTimeout(() => {
    toast.classList.add("leaving");
    window.setTimeout(() => toast.remove(), 220);
  }, 3300);
}

function openSidebar() {
  sidebar.classList.add("is-open");
  sidebarScrim.classList.add("is-visible");
}

function closeSidebar() {
  sidebar.classList.remove("is-open");
  sidebarScrim.classList.remove("is-visible");
}

$("#mobileMenuTrigger")?.addEventListener("click", openSidebar);
$("#sidebarClose")?.addEventListener("click", closeSidebar);
sidebarScrim?.addEventListener("click", closeSidebar);

const modalLayers = $$(".modal-layer");

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  window.setTimeout(() => modal.querySelector("select, input, textarea")?.focus(), 90);
}

function closeModal(modal) {
  const layer = typeof modal === "string" ? document.getElementById(modal) : modal;
  if (!layer) return;
  layer.classList.remove("is-open");
  layer.setAttribute("aria-hidden", "true");
  if (!modalLayers.some((item) => item.classList.contains("is-open"))) {
    document.body.classList.remove("modal-open");
  }
}

function setBookingSpecialty(specialty = "") {
  const select = $("#specialtySelect");
  if (!select) return;
  const option = [...select.options].find((item) => item.value === specialty);
  select.value = option ? specialty : "";
  updateDoctorOptions();
}

const doctorsBySpecialty = {
  "Tim mạch": ["Nguyễn Minh Anh, MD", "Phạm Hoàng Nam, MD"],
  "Thần kinh": ["Đỗ Minh Khoa, MD", "Chuyên gia bất kỳ"],
  "Nhi khoa": ["Lê Thu Hà, MD", "Chuyên gia bất kỳ"],
  "Da liễu": ["Vũ Ngọc Linh, MD", "Chuyên gia bất kỳ"],
  "Nội tiết học": ["Trần Khánh Vy, PhD", "Chuyên gia bất kỳ"],
  "Y học gia đình": ["Lê Hoàng Mai, MD", "Chuyên gia bất kỳ"]
};

function updateDoctorOptions() {
  const specialty = $("#specialtySelect")?.value;
  const doctorSelect = $("#doctorSelect");
  if (!doctorSelect) return;
  const options = specialty && doctorsBySpecialty[specialty]
    ? doctorsBySpecialty[specialty]
    : ["Nguyễn Minh Anh, MD", "Trần Khánh Vy, PhD", "Phạm Hoàng Nam, MD", "Chuyên gia bất kỳ"];
  const current = doctorSelect.value;
  doctorSelect.innerHTML = '<option value="">Chọn chuyên gia</option>';
  options.forEach((doctor) => {
    const option = document.createElement("option");
    option.value = doctor;
    option.textContent = doctor;
    doctorSelect.append(option);
  });
  if (options.includes(current)) doctorSelect.value = current;
}

function openBooking(specialty = "") {
  setBookingSpecialty(specialty);
  openModal("bookingModal");
}

$$('.book-trigger, [data-action="book"]').forEach((trigger) => {
  trigger.addEventListener("click", () => openBooking(trigger.dataset.specialty || ""));
});

$("#specialtySelect")?.addEventListener("change", updateDoctorOptions);

$("#bookingForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const specialty = $("#specialtySelect").value || "chuyên khoa đã chọn";
  const doctor = $("#doctorSelect").value || "chuyên gia phù hợp";
  const dateValue = $("#appointmentDate").value;
  const date = dateValue
    ? new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(new Date(`${dateValue}T12:00:00`))
    : "ngày đã chọn";
  const tag = $(".appointment-featured .tag");
  if (tag) {
    tag.innerHTML = '<span class="tag-dot"></span> ĐÃ XÁC NHẬN';
  }
  closeModal("bookingModal");
  showToast(`Đã gửi yêu cầu với ${doctor} · ${specialty} vào ngày ${date}.`);
});

$$("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", () => closeModal(element.closest(".modal-layer")));
});

$("#profileTrigger")?.addEventListener("click", () => openModal("profileModal"));

const pageTitle = $("#pageTitle");
const viewTargets = {
  overview: "overview",
  appointments: "appointmentsSection",
  doctors: "specialtiesSection",
  records: "healthSnapshot",
  wellness: "healthSnapshot",
  pharmacy: "specialtiesSection",
  locations: "locationsSection",
  support: "insightSection"
};

function activateView(view, title, shouldScroll = true) {
  const targetId = viewTargets[view] || "overview";
  const target = document.getElementById(targetId) || $(".insight-section");
  $$(".nav-link").forEach((link) => link.classList.toggle("active", link.dataset.view === view));
  if (pageTitle && title) pageTitle.textContent = title;
  if (shouldScroll && target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  closeSidebar();
}

$$(".nav-link").forEach((link) => {
  link.addEventListener("click", () => activateView(link.dataset.view, link.dataset.title));
});

$$('[data-view]:not(.nav-link)').forEach((element) => {
  element.addEventListener("click", () => activateView(element.dataset.view, element.dataset.title || undefined));
});

$$("[data-scroll-target]").forEach((element) => {
  element.addEventListener("click", () => {
    const target = document.getElementById(element.dataset.scrollTarget);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const notificationTrigger = $("#notificationTrigger");
const notificationPanel = $("#notificationPanel");

notificationTrigger?.addEventListener("click", (event) => {
  event.stopPropagation();
  notificationPanel.classList.toggle("is-open");
});

$$('[data-toast]').forEach((element) => {
  element.addEventListener("click", (event) => {
    event.stopPropagation();
    showToast(element.dataset.toast);
  });
});

const searchInput = $("#globalSearch");
const searchResults = $("#searchResults");
const searchResultsList = $("#searchResultsList");
const searchResultCount = $("#searchResultCount");
const SEARCH_ITEMS = [
  { label: "Nguyễn Minh Anh, MD", detail: "Tim mạch · Cơ sở Quận 1", icon: "stethoscope", view: "doctors" },
  { label: "Trần Khánh Vy, PhD", detail: "Nội tiết học · Cơ sở Thảo Điền", icon: "stethoscope", view: "doctors" },
  { label: "Tim mạch", detail: "18 chuyên gia · 4 cơ sở", icon: "heart-pulse", view: "doctors" },
  { label: "Kết quả xét nghiệm", detail: "3 tài liệu mới · cập nhật hôm nay", icon: "flask-conical", view: "records" },
  { label: "Medora Quận 1", detail: "24 Lê Thánh Tôn · 1.2 km", icon: "map-pin", view: "locations" }
];

function renderSearchResults(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    searchResults.classList.remove("is-open");
    return;
  }
  const matches = SEARCH_ITEMS.filter((item) => `${item.label} ${item.detail}`.toLowerCase().includes(normalized));
  searchResultCount.textContent = `${matches.length} kết quả`;
  searchResultsList.innerHTML = "";
  if (!matches.length) {
    searchResultsList.innerHTML = '<div class="empty-search">Không tìm thấy kết quả phù hợp. Hãy thử từ khóa khác.</div>';
  } else {
    matches.slice(0, 4).forEach((item) => {
      const result = document.createElement("button");
      result.className = "search-result-item";
      result.dataset.searchLabel = item.label;
      result.dataset.searchView = item.view;
      result.innerHTML = `<span class="result-icon"><span class="icon" data-icon="${item.icon}"></span></span><span><strong>${item.label}</strong><small>${item.detail}</small></span>`;
      searchResultsList.append(result);
      renderIcons(result);
    });
  }
  searchResults.classList.add("is-open");
}

searchInput?.addEventListener("input", () => renderSearchResults(searchInput.value));
searchInput?.addEventListener("focus", () => {
  if (searchInput.value) renderSearchResults(searchInput.value);
});

searchResultsList?.addEventListener("click", (event) => {
  const result = event.target.closest(".search-result-item");
  if (!result) return;
  activateView(result.dataset.searchView, result.dataset.searchLabel);
  searchResults.classList.remove("is-open");
  if (searchInput) searchInput.value = "";
});

const rangeValues = {
  "7 ngày": { total: "42.8", change: "+12.4%" },
  "30 ngày": { total: "184.2", change: "+8.1%" },
  "3 tháng": { total: "501.7", change: "+16.9%" }
};

$$('.date-switch').forEach((switcher) => {
  switcher.addEventListener("click", () => {
    $$(".date-switch").forEach((button) => button.classList.remove("active"));
    switcher.classList.add("active");
    const value = rangeValues[switcher.dataset.range];
    if (!value) return;
    $("#chartTotal").textContent = value.total;
    $(".chart-stat i").textContent = value.change;
    $(".activity-chart").setAttribute("aria-label", `Biểu đồ vận động trong ${switcher.dataset.range}`);
    showToast(`Đã chuyển sang dữ liệu ${switcher.dataset.range}.`);
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".notification-panel, #notificationTrigger")) {
    notificationPanel?.classList.remove("is-open");
  }
  if (!event.target.closest(".search-results, .search-field")) {
    searchResults?.classList.remove("is-open");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    modalLayers.forEach((modal) => closeModal(modal));
    notificationPanel?.classList.remove("is-open");
    searchResults?.classList.remove("is-open");
    closeSidebar();
  }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput?.focus();
  }
});
