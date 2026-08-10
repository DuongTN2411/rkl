let colors = ["red", "blue", "green", "yellow", "purple"];
let btn = document.getElementById("btn-change");
let display = document.getElementById("color-display");

btn.addEventListener("click", function() {
  let randomIndex = Math.floor(Math.random() * colors.length);
  let randomColor = colors[randomIndex];
  document.body.style.backgroundColor = randomColor;
  display.innerText = "Màu hiện tại: " + randomColor;
});
