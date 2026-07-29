console.log(message);
let message = "Hello";
console.log(message);

function kiemTraScope() {
  let bienTrongHam = "Tôi ở trong hàm";
  console.log("Trong hàm:", bienTrongHam);
}

kiemTraScope();

try {
  console.log(bienTrongHam);
} catch (e) {
  console.log("Lỗi Scope:", e.message);
}
