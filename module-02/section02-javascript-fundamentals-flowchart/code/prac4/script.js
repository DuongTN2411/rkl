let x = 10;

{
  let x = 20;
  console.log("Trong block:", x);
}

console.log("Ngoài block:", x);

const y = 100;
console.log("const y:", y);

//Biến x trong và ngoài block là 2 biến hoàn toàn khác nhau, biến trong block không ghi đè hay ảnh hưởng đến biến bên ngoài
