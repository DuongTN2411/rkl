// let products = ["máy quạt", "máy lanh", "tivi", "máy giặt"];

// let person = ["Lan", 18, false, null];

// // let len = products.length;
// // for (let i = 0; i < products.length; i++) {
// //   console.log(products[i]);
// // }

// products.splice(2, 1, "may tinh");

// // let i = 0;
// // while (true) {
// //   if (i >= products.length) {
// //     break;
// //   }
// //   console.log(products[i]);
// //   i++;
// // }

// // let search = prompt("nhap ten san pham:");
// // let found = false;
// // for (let i = 0; i < products.length; i++) {
// //   if (products[i].includes(search)) {
// //     console.log("tim thay gan dung:", products[i], "tai vi tri", i);
// //     found = true;
// //   }
// // }
// // if (!found) {
// //   console.log("khong tim thay");
// // }

// let search = prompt("nhap ten san pham:");
// let found = false;
// let arrayTemp = [];
// for (let i = 0; i < products.length; i++) {
//   if (products[i].includes(search)) {
//     arrayTemp.push(products[i]);
//     found = true;
//   }
// }
// console.log(arrayTemp);
// if ((arrayTemp.length = 0)) {
//   console.log("khong tim thay");
// }

// function sum(a, b) {
//   let result = a + b;
//   return result;
// }

// console.log(sum(3, 5));
let numbers = [1, 4, 2, 5, 6, 9];

function sum(array) {
  let tong = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] % 2 === 0) {
      tong += array[i];
    }
  }
  return tong;
}

console.log(sum(numbers));
