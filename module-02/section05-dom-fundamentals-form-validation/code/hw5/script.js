let input = document.getElementById("user-input");
let display = document.getElementById("key-display");

input.addEventListener("keydown", function(e) {
  display.innerText = "Phím vừa nhấn: " + e.key;
});
