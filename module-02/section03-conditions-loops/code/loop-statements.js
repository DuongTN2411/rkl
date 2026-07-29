for (let i = 0; i <= 10; i++) {
  console.log(i);
}

let input = "";
let count = 0;

while (input.toLowerCase() !== "exit") {
  input = prompt("type any word (type 'exit' to quit):");
  count++;
}

console.log("Number of words you input are:" + count + "words");

for (let i = 0; i < 10; i++) {
  if (i == 5) {
    break;
  }
  console.log(i);
}
