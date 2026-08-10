let prices = [100, 200, 300, 400];

let totalPrice = prices.reduce(function(sum, price) {
  return sum + price;
}, 0);

let vat = totalPrice * 0.1;
let finalTotal = totalPrice + vat;

console.log("Tổng giá:", totalPrice);
console.log("Thuế VAT (10%):", vat);
console.log("Tổng thanh toán:", finalTotal);
