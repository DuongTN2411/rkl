const listeners = [];

function dispatch(action) {
  errorNotificationMiddleware(action);
  listeners.forEach(function (l) { l(action); });
}

function errorNotificationMiddleware(action) {
  if (action.type && action.type.endsWith('.rejected')) {
    showToast(action.error.message, false);
  }
}

function showToast(msg, success) {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast-item' + (success ? ' success' : '');
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(function () { el.remove(); }, 3000);
}

function api_call(shouldFail, errorMessage) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (shouldFail) reject(new Error(errorMessage));
      else resolve({ ok: true });
    }, 400);
  });
}

function callApi(type, shouldFail, errorMessage) {
  dispatch({ type: type + '.pending' });
  api_call(shouldFail, errorMessage)
    .then(function (data) {
      dispatch({ type: type + '.fulfilled', payload: data });
      showToast('Gọi API "' + type + '" thành công.', true);
    })
    .catch(function (err) {
      dispatch({ type: type + '.rejected', error: { message: '[' + type + '] ' + err.message } });
    });
}

document.getElementById('btn-401').addEventListener('click', function () {
  callApi('api/getUser', true, '401 Unauthorized - Vui lòng đăng nhập lại.');
});
document.getElementById('btn-500').addEventListener('click', function () {
  callApi('api/getOrders', true, '500 Internal Server Error - Vui lòng thử lại sau.');
});
document.getElementById('btn-ok').addEventListener('click', function () {
  callApi('api/getProducts', false, '');
});
