let i;
let tong = 0;

for (i = 1; i <= 50; i++) {
  if (i % 5 === 0) {
    continue;
  }
  tong = tong + i;
  console.log(i);
  if (tong > 200) {
    break;
  }
}
console.log(tong);
