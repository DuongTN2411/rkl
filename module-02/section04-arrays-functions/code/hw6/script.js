let colors = ["Red", "Green", "Blue"];

let indexGreen = colors.indexOf("Green");
colors.splice(indexGreen, 1, "Yellow", "Pink");

console.log(colors);
