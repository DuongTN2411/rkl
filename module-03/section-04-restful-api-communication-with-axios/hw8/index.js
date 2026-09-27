import axios from "axios";

axios.interceptors.response.use(
  (response) => response,
  (err) => {
    if (err.response) {
      if (err.response.status === 401) {
        console.log("Phiên đăng nhập hết hạn. Chuyển hướng về trang đăng nhập.");
      } else if (err.response.status === 500) {
        console.log("Lỗi máy chủ. Vui lòng thử lại sau.");
      }
    }
    return Promise.reject(err);
  }
);

axios.get("http://localhost:3004/protected").catch((err) => {
  console.log(err.message);
});
