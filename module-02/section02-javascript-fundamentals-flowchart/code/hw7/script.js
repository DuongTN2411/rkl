let chuyenCan = Number(prompt("Nhập % chuyên cần:"));
let diemTrungBinh = Number(prompt("Nhập điểm trung bình:"));
let coGiayPhep = confirm("Có giấy phép đặc biệt không?");

let duocDuThi = (chuyenCan > 80 && diemTrungBinh >= 5) || coGiayPhep;

console.log("Chuyên cần:", chuyenCan);
console.log("Điểm TB:", diemTrungBinh);
console.log("Giấy phép:", coGiayPhep);
console.log("Được dự thi:", duocDuThi);
