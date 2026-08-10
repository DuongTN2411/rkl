function sumAllNumbers(...numbers) {
  let total = 0;
  for (const num of numbers) {
    total += num;
  }
  return total;
}

console.log(sumAllNumbers(1, 2, 3));
console.log(sumAllNumbers(10, 20, 30, 40));
console.log(sumAllNumbers(5));