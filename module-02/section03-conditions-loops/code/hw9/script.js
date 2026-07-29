var a = Number(prompt("Nhap vao 1 so nguyen bat ky:"));
var flag = true;

if (a <= 2) {
  flag = false;
} else {
  for (var i = 2; i < a; i++) {
    if (a % i === 0) {
      flag = false;
      break;
    }
  }
}

if (flag) {
  console.log(a + " la so nguyen to");
} else {
  console.log(a + " khong la so nguyen to");
}
