var i;
do {
  i = Number(prompt("Nhập 1 số (từ 1 đến 10):"));
  if (i < 1 || i > 10) {
    console.log("Vui long nhap lai");
  }
} while (i < 1 || i > 10);
console.log("So hop le:", i);
