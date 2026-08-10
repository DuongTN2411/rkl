let tienLuong = Number(prompt("Nhap tien luong(don vi: trieu dong):"));
let doTuoi = Number(prompt("Do tuoi:"));
let noXau = false;

if (tienLuong > 15 && noXau === false) {
  if (doTuoi > 18 && doTuoi < 60) {
    console.log("Du dieu kien vay");
  } else {
    console.log("Ban khong du tuoi de vay");
  }
} else {
  console.log("Ban khong du dieu kien vay");
}
