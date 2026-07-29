let n = Number(
  prompt(
    "Nhap vao so thu tu mon an (1. Cafe, 2. Cam vắt, 3. Trà sữa, 4. Coca):"
  )
);

switch (n) {
  case 1:
    console.log("Ban da chon Cafe");
    break;
  case 2:
    console.log("Ban da chon Cam vat");
    break;
  case 3:
    console.log("Ban da chon Tra sua");
    break;
  case 4:
    console.log("Ban da chon Coca");
    break;
  default:
    console.log("Mon an khong ton tai");
}
