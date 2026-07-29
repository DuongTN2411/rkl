let sum = 0;

while (true) {
  let i = Number(prompt("Nhap vao 1 so (Nhap 0 de dung lai):"));
  if (i === 0) {
    break;
  }
  sum = sum + i;
}

console.log("Tong cac so vua nhap la: " + sum);
