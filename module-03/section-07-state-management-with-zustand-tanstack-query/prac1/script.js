function createStore(initializer) {
  let state;
  const listeners = [];

  function setState(partial) {
    const next = typeof partial === 'function' ? partial(state) : partial;
    state = Object.assign({}, state, next);
    listeners.forEach(function (fn) { fn(state); });
  }

  function getState() {
    return state;
  }

  function subscribe(listener, selector) {
    if (!selector) {
      listeners.push(listener);
      return;
    }
    let selected = selector(state);
    listeners.push(function (newState) {
      const nextSelected = selector(newState);
      if (nextSelected !== selected) {
        selected = nextSelected;
        listener(nextSelected);
      }
    });
  }

  state = initializer(setState, getState);
  return { getState: getState, setState: setState, subscribe: subscribe };
}

const useAppStore = createStore(function () {
  return {
    theme: 'light',
    sidebarOpen: false,
    userRole: 'admin',
  };
});

let countBad = 0;
let countGood = 0;
let countSidebar = 0;

function renderHeaderBad() {
  countBad++;
  const state = useAppStore.getState();
  const el = document.getElementById('header-bad');
  el.className = 'header-box ' + (state.theme === 'dark' ? 'bg-black' : 'bg-white');
  document.getElementById('count-bad').textContent = countBad;
}

function renderHeaderGood(theme) {
  countGood++;
  const el = document.getElementById('header-good');
  el.className = 'header-box ' + (theme === 'dark' ? 'bg-black' : 'bg-white');
  document.getElementById('count-good').textContent = countGood;
}

function renderSidebar(state) {
  countSidebar++;
  const el = document.getElementById('sidebar-box');
  el.textContent = 'Sidebar - ' + (state.sidebarOpen ? 'Đang mở' : 'Đang đóng');
  document.getElementById('count-sidebar').textContent = countSidebar;
}

useAppStore.subscribe(renderHeaderBad);
useAppStore.subscribe(renderHeaderGood, function (s) { return s.theme; });
useAppStore.subscribe(renderSidebar);

renderHeaderBad();
renderHeaderGood(useAppStore.getState().theme);
renderSidebar(useAppStore.getState());

document.getElementById('btn-theme').addEventListener('click', function () {
  const cur = useAppStore.getState().theme;
  const next = cur === 'light' ? 'dark' : 'light';
  useAppStore.setState({ theme: next });
  document.getElementById('theme-label').textContent = next;
});

document.getElementById('btn-sidebar').addEventListener('click', function () {
  const cur = useAppStore.getState().sidebarOpen;
  useAppStore.setState({ sidebarOpen: !cur });
});

document.getElementById('select-role').addEventListener('change', function (e) {
  useAppStore.setState({ userRole: e.target.value });
});
