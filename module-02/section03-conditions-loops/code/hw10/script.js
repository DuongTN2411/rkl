let randomNumber = Math.floor(Math.random() * 100 + 1);
let soLan = 5;
let doanTrung = false;

console.log(randomNumber);
for (i = 1; i <= 5; i++) {
  let userNumber = Number(prompt("So ban doan la:"));
  if (userNumber < randomNumber) {
    console.log(userNumber + " qua nho");
  } else if (userNumber > randomNumber) {
    console.log(userNumber + " qua lon");
  } else if ((userNumber = randomNumber)) {
    doanTrung = true;
    break;
  }
}

if (doanTrung) {
  console.log(randomNumber + " la dap an chinh xac");
} else {
  console.log("Gameover");
}
