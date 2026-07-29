let rainLevel = "Heavily Raining";
// if (rainLevel === "Lightly Raining") {
//   console.log("Wear a raincoat to work");
// } else if (rainLevel === "Heavily Raining") {
//   console.log("Stay home");
// } else {
//   console.log("Go to work like normal");
// }

switch (rainLevel) {
  case "Heavily Rainning":
    console.log("Stay home");
    break;
  case "Lightly Raining":
    console.log("Wear a raincoat to work");
    break;
  default: //"not raining"
    console.log("Go to work like normal");
    break;
}
