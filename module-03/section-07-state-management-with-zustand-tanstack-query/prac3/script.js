function safeStorage() {
  try {
    const testKey = '__cart_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return {
      getItem: function (k) { return window.localStorage.getItem(k); },
      setItem: function (k, v) { window.localStorage.setItem(k, v); },
      ok: true,
    };
  } catch (e) {
    const memory = {};
    return {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(memory, k) ? memory[k] : null; },
      setItem: function (k, v) { memory[k] = v; },
      ok: false,
    };
  }
}

const storage = safeStorage();
const CART_KEY = 'cart-storage';

function persistMiddleware(createStoreFn) {
  return function (initializer) {
    const store = createStoreFn(function (set, get) {
      const state = initializer(set, get);
      let saved = null;
      try {
        const raw = storage.getItem(CART_KEY);
        if (raw) saved = JSON.parse(raw);
      } catch (e) {
        saved = null;
      }
      return saved ? Object.assign({}, state, saved) : state;
    });
    const originalSet = store.setState;
    store.setState = function (partial) {
      originalSet(partial);
      try {
        storage.setItem(CART_KEY, JSON.stringify(store.getState()));
      } catch (e) {
        /* im lặng bỏ qua nếu ghi lỗi, tránh crash */
      }
    };
    return store;
  };
}

function baseCreateStore(initializer) {
  let state;
  const listeners = [];
  function setState(partial) {
    const next = typeof partial === 'function' ? partial(state) : partial;
    state = Object.assign({}, state, next);
    listeners.forEach(function (l) { l(state); });
  }
  function getState() { return state; }
  function subscribe(l) { listeners.push(l); }
  const tmpStore = { setState: setState, getState: getState, subscribe: subscribe };
  state = initializer(setState, getState);
  return tmpStore;
}

const createPersistedStore = persistMiddleware(baseCreateStore);

const useCartStore = createPersistedStore(function () {
  return { items: [] };
});

if (!storage.ok) {
  document.getElementById('storage-warning').classList.remove('hidden');
}

function addToCart(id, name, price) {
  const state = useCartStore.getState();
  const existing = state.items.find(function (i) { return i.id === id; });
  let items;
  if (existing) {
    items = state.items.map(function (i) {
      return i.id === id ? Object.assign({}, i, { qty: i.qty + 1 }) : i;
    });
  } else {
    items = state.items.concat([{ id: id, name: name, price: price, qty: 1 }]);
  }
  useCartStore.setState({ items: items });
}

function clearCart() {
  useCartStore.setState({ items: [] });
}

function renderCart(state) {
  const list = document.getElementById('cart-list');
  list.innerHTML = '';
  let total = 0;
  let count = 0;
  state.items.forEach(function (i) {
    total += i.price * i.qty;
    count += i.qty;
    const li = document.createElement('li');
    li.innerHTML = '<span>' + i.name + ' x' + i.qty + '</span><span>' +
      (i.price * i.qty).toLocaleString('vi-VN') + ' đ</span>';
    list.appendChild(li);
  });
  document.getElementById('cart-count').textContent = count;
  document.getElementById('cart-total').textContent = total.toLocaleString('vi-VN') + ' đ';
}

useCartStore.subscribe(renderCart);
renderCart(useCartStore.getState());

document.querySelectorAll('.btn-add').forEach(function (btn) {
  btn.addEventListener('click', function () {
    const card = btn.closest('.product-card');
    addToCart(Number(card.dataset.id), card.dataset.name, Number(card.dataset.price));
  });
});

document.getElementById('btn-clear').addEventListener('click', clearCart);
