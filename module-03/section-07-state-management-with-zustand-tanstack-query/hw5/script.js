const productsDb = [
  { id: 1, name: 'Laptop Dell XPS 13' },
  { id: 2, name: 'Laptop Asus Zenbook' },
  { id: 3, name: 'Laptop MacBook Air' },
  { id: 4, name: 'Chuột Logitech' },
  { id: 5, name: 'Bàn phím cơ Laptop Stand' },
];

const searchSlice = {
  keyword: '',
  setKeyword: function (value) {
    searchSlice.keyword = value;
    document.getElementById('search-slice-value').textContent = value;
    fetchProductsFromSlice();
  },
};

let callCount = 0;

function api_searchProducts(keyword) {
  callCount++;
  return new Promise(function (resolve) {
    setTimeout(function () {
      const result = productsDb.filter(function (p) {
        return p.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
      });
      resolve(result);
    }, 300);
  });
}

function fetchProductsFromSlice() {
  const keyword = searchSlice.keyword.trim();
  const status = document.getElementById('api-status');
  const list = document.getElementById('result-list');

  if (!keyword) {
    status.textContent = 'Từ khóa rỗng (hoặc chỉ khoảng trắng) sau trim() - KHÔNG gọi API.';
    list.innerHTML = '';
    return;
  }

  status.textContent = 'Đang gọi API với keyword="' + keyword + '" (lần gọi API thứ ' + (callCount + 1) + ')...';

  api_searchProducts(keyword).then(function (data) {
    status.textContent = 'Đã gọi API thành công (tổng số lần gọi API: ' + callCount + ').';
    list.innerHTML = '';
    if (!data.length) {
      list.innerHTML = '<li>Không tìm thấy sản phẩm nào.</li>';
      return;
    }
    data.forEach(function (p) {
      const li = document.createElement('li');
      li.textContent = p.name;
      list.appendChild(li);
    });
  });
}

document.getElementById('search-input').addEventListener('input', function (e) {
  searchSlice.setKeyword(e.target.value);
});
