// 1. if (if thieu)
let isRaining = true;
if (isRaining === true) {
  console.log("It's raining now");
}
// 2. if-else (if du)
if (isRaining === true) {
  console.log("It's raining now");
} else {
  console.log("It's NOT raining now");
}
// 3. if-else-if(if bac thang)
//3 rain levels: lightly raining, heavily raining, not raining
// let rainLevel = prompt("How's the weather today?");
let rainLevel = "Heavily Raining";
if (rainLevel === "Lightly Raining") {
  console.log("Wear a raincoat to work");
} else if (rainLevel === "Heavily Raining") {
  console.log("Stay home");
} else {
  console.log("Go to work like normal");
}
// 4. nested-if (if long nhau)
let isSunny = false;
let hasSunJacket = true;

if (isSunny === true) {
  if (hasSunJacket === true) {
    console.log("Go to work");
  } else {
    console.log("Stay home");
  }
} else {
  console.log("Go to work without sun jacket");
}

// 5. nested clean code
let isCloudy = false;
let hasSkite = false;
let isFeelingWell = true;

if (isCloudy === true) {
  console.log("Stay home");
} else if (hasSkite === false) {
  console.log("Buy skite");
} else if (isFeelingWell === false) {
  console.log("Rest");
} else {
  console.log("Go to the park and play skite");
}

// 6. ternary operator (toan tu 3 ngoi)
let isBoy = false;
let result = isBoy ? "It's a boy" : "It's a girl";
console.log(result);
