let w = Number(prompt("Nhap chieu rong:"));
let h = Number(prompt("Nhap chieu cao:"));

for (let x = 1; x <= h; x++) {
  let line = "";
  for (let y = 1; y <= w; y++) {
    line = line + "*";
  }
  console.log(line);
}
