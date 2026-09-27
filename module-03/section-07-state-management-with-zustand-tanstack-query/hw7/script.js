let liked = false;
let likeCount = 12;

function api_toggleLike(shouldLike) {
  const simulateError = document.getElementById('simulate-error').checked;
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (simulateError) {
        reject(new Error('Network Error - server không phản hồi được'));
      } else {
        resolve({ liked: shouldLike });
      }
    }, 2000);
  });
}

function updateUI() {
  const btn = document.getElementById('like-btn');
  document.getElementById('like-count').textContent = likeCount;
  btn.classList.toggle('liked', liked);
  btn.textContent = (liked ? '💙 Đã thích' : '🤍 Thích') + ' (' + likeCount + ')';
  const span = document.createElement('span');
  span.id = 'like-count';
  span.textContent = likeCount;
}

function handleLikeClickOptimistic() {
  const btn = document.getElementById('like-btn');
  const status = document.getElementById('like-status');
  const nextLiked = !liked;

  const prevLiked = liked;
  const prevCount = likeCount;

  liked = nextLiked;
  likeCount = likeCount + (nextLiked ? 1 : -1);
  renderButton();
  status.textContent = 'Đã cập nhật UI ngay lập tức (Optimistic), đang chờ server xác nhận...';

  api_toggleLike(nextLiked)
    .then(function () {
      status.textContent = 'Server xác nhận thành công.';
    })
    .catch(function (err) {
      liked = prevLiked;
      likeCount = prevCount;
      renderButton();
      status.textContent = 'Lỗi: ' + err.message + ' -> đã Rollback UI về trạng thái trước đó.';
    });
}

function renderButton() {
  const btn = document.getElementById('like-btn');
  btn.classList.toggle('liked', liked);
  btn.innerHTML = (liked ? '💙 Đã thích' : '🤍 Thích') + ' (<span id="like-count">' + likeCount + '</span>)';
}

document.getElementById('like-btn').addEventListener('click', handleLikeClickOptimistic);
renderButton();
