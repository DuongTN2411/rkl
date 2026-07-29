var a = Number(prompt("Nhập số A:"));
var b = Number(prompt("Nhập số B:"));
var phepTinh = prompt("Nhập phép tính (+, -, *, /):");

var ketQua;

if (phepTinh === "+") {
  ketQua = a + b;
} else if (phepTinh === "-") {
  ketQua = a - b;
} else if (phepTinh === "*") {
  ketQua = a * b;
} else if (phepTinh === "/") {
  ketQua = a / b;
} else {
  ketQua = "Phép tính không hợp lệ";
}

var thongBao = "Kết quả của " + a + " " + phepTinh + " " + b + " là: " + ketQua;
console.log(thongBao);
alert(thongBao);
