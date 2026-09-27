let nextId = 4;
let db = [
  { id: 1, name: 'Bàn phím cơ' },
  { id: 2, name: 'Chuột không dây' },
  { id: 3, name: 'Màn hình 27 inch' },
];

const apiSlice = { cache: { Product: { data: null, isStale: true } } };

function shouldFail() {
  const cb = document.getElementById('simulate-error');
  const val = cb.checked;
  cb.checked = false;
  return val;
}

function api_getProducts() {
  return new Promise(function (resolve) {
    setTimeout(function () { resolve(JSON.parse(JSON.stringify(db))); }, 300);
  });
}

function api_addProduct(name) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (shouldFail()) return reject(new Error('Thêm sản phẩm thất bại (giả lập lỗi 500)'));
      const item = { id: nextId++, name: name };
      db.push(item);
      resolve(item);
    }, 400);
  });
}

function api_deleteProduct(id) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (shouldFail()) return reject(new Error('Xóa sản phẩm thất bại (giả lập lỗi 500)'));
      db = db.filter(function (p) { return p.id !== id; });
      resolve({ id: id });
    }, 400);
  });
}

function invalidateTag(tag) {
  apiSlice.cache[tag].isStale = true;
  return refetchProducts();
}

function refetchProducts() {
  if (!apiSlice.cache.Product.isStale && apiSlice.cache.Product.data) {
    renderTable(apiSlice.cache.Product.data);
    return Promise.resolve();
  }
  return api_getProducts().then(function (data) {
    apiSlice.cache.Product.data = data;
    apiSlice.cache.Product.isStale = false;
    renderTable(data);
  });
}

function renderTable(data) {
  const tbody = document.getElementById('product-tbody');
  tbody.innerHTML = '';
  data.forEach(function (p) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td>' + p.id + '</td><td>' + p.name + '</td><td></td>';
    const btn = document.createElement('button');
    btn.className = 'btn-delete';
    btn.textContent = 'Xóa';
    btn.addEventListener('click', function () { handleDelete(p.id); });
    tr.lastElementChild.appendChild(btn);
    tbody.appendChild(tr);
  });
}

function showToast(msg, isError) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast' + (isError ? ' error' : '');
  el.classList.remove('hidden');
  setTimeout(function () { el.classList.add('hidden'); }, 2500);
}

function handleAdd() {
  const input = document.getElementById('new-product-name');
  const name = input.value.trim();
  if (!name) return;
  api_addProduct(name)
    .then(function () {
      showToast('Thêm sản phẩm thành công!', false);
      input.value = '';
      invalidateTag('Product');
    })
    .catch(function (err) {
      showToast(err.message + ' (danh sách KHÔNG bị gọi lại)', true);
    });
}

function handleDelete(id) {
  api_deleteProduct(id)
    .then(function () {
      showToast('Xóa thành công!', false);
      invalidateTag('Product');
    })
    .catch(function (err) {
      showToast(err.message + ' (danh sách KHÔNG bị gọi lại)', true);
    });
}

document.getElementById('btn-add').addEventListener('click', handleAdd);
refetchProducts();
