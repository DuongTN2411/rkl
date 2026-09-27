let db = [
  { id: 1, name: 'Bàn phím cơ', price: 890000, updatedAt: '-' },
  { id: 2, name: 'Chuột không dây', price: 350000, updatedAt: '-' },
  { id: 3, name: 'Màn hình 27 inch', price: 4200000, updatedAt: '-' },
];

const queryCache = { products: { data: null, isStale: true } };

function api_getProducts() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(JSON.parse(JSON.stringify(db)));
    }, 400);
  });
}

function api_updatePrice(id, newPrice) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      const item = db.find(function (p) { return p.id === id; });
      item.price = newPrice;
      item.updatedAt = new Date().toLocaleTimeString();
      resolve(JSON.parse(JSON.stringify(item)));
    }, 500);
  });
}

function queryClient_invalidate(key) {
  queryCache[key].isStale = true;
  return fetchProductsQuery();
}

function fetchProductsQuery() {
  if (!queryCache.products.isStale && queryCache.products.data) {
    renderTable(queryCache.products.data);
    return Promise.resolve(queryCache.products.data);
  }
  return api_getProducts().then(function (data) {
    queryCache.products.data = data;
    queryCache.products.isStale = false;
    renderTable(data);
    populateSelect(data);
    return data;
  });
}

function renderTable(data) {
  const tbody = document.getElementById('product-tbody');
  tbody.innerHTML = '';
  data.forEach(function (p) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td>' + p.id + '</td><td>' + p.name + '</td><td>' +
      p.price.toLocaleString('vi-VN') + ' đ</td><td>' + p.updatedAt + '</td>';
    tbody.appendChild(tr);
  });
}

function populateSelect(data) {
  const select = document.getElementById('product-select');
  if (select.options.length) return;
  data.forEach(function (p) {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.name;
    select.appendChild(opt);
  });
}

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  setTimeout(function () { el.classList.add('hidden'); }, 2000);
}

document.getElementById('btn-update').addEventListener('click', function () {
  const id = Number(document.getElementById('product-select').value);
  const price = Number(document.getElementById('new-price').value);
  if (!id || !price) return;
  const btn = document.getElementById('btn-update');
  btn.disabled = true;
  api_updatePrice(id, price).then(function () {
    showToast('Cập nhật giá thành công!');
    queryClient_invalidate('products').then(function () {
      btn.disabled = false;
    });
  });
});

fetchProductsQuery();
