let a = Number(prompt("Nhập số A:"));
let b = Number(prompt("Nhập số B:"));
let phepTinh = prompt("Nhập phép tính (+, -, *, /):");

let ketQua;

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

let thongBao = "Kết quả của " + a + " " + phepTinh + " " + b + " là: " + ketQua;
console.log(thongBao);
alert(thongBao);
