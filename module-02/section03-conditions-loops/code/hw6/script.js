var w = Number(prompt("Nhap chieu rong:"));
var h = Number(prompt("Nhap chieu cao:"));

for (var x = 1; x <= h; x++) {
  var line = "";
  for (var y = 1; y <= w; y++) {
    line = line + "*";
  }
  console.log(line);
}
