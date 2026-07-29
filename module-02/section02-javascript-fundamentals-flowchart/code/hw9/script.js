const ADMIN_USER = "admin";
const ADMIN_PASS = "123456";

var userName = prompt("Nhập tên đăng nhập:");
var userPass = prompt("Nhập mật khẩu:");

if (userName === ADMIN_USER && userPass === ADMIN_PASS) {
  alert("Đăng nhập thành công! Chào mừng " + userName);
  console.log("Đăng nhập thành công");
} else {
  alert("Tên đăng nhập hoặc mật khẩu không đúng.");
  console.log("Đăng nhập thất bại");
}
