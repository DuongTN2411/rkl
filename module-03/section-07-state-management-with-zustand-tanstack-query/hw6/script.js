const productsDb = [
  'Macbook Air M2', 'Macbook Pro 14', 'Macbook Pro 16',
  'Dell XPS 13', 'Asus Zenbook 14', 'Chuột Logitech MX',
];

let requestCount = 0;
let debounceTimer = null;
const DEBOUNCE_DELAY = 400;

function api_search(keyword) {
  requestCount++;
  document.getElementById('request-count').textContent = requestCount;
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(productsDb.filter(function (p) {
        return p.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
      }));
    }, 300);
  });
}

function renderResults(data) {
  const list = document.getElementById('result-list');
  list.innerHTML = '';
  data.forEach(function (name) {
    const li = document.createElement('li');
    li.textContent = name;
    list.appendChild(li);
  });
}

function debouncedSearch(keyword) {
  if (debounceTimer) clearTimeout(debounceTimer);
  const status = document.getElementById('api-status');
  status.textContent = 'Đang chờ người dùng ngừng gõ (debounce ' + DEBOUNCE_DELAY + 'ms)...';

  debounceTimer = setTimeout(function () {
    const trimmed = keyword.trim();
    if (!trimmed) {
      status.textContent = 'Từ khóa rỗng - không gọi API.';
      renderResults([]);
      return;
    }
    status.textContent = 'Đang gọi API với "' + trimmed + '"...';
    api_search(trimmed).then(function (data) {
      status.textContent = 'API trả về ' + data.length + ' kết quả.';
      renderResults(data);
    });
  }, DEBOUNCE_DELAY);
}

document.getElementById('search-input').addEventListener('input', function (e) {
  document.getElementById('char-count').textContent =
    Number(document.getElementById('char-count').textContent) + 1;
  debouncedSearch(e.target.value);
});
