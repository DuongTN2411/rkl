let btn = document.getElementById("btn-toggle");
let box = document.getElementById("my-box");

btn.addEventListener("click", function() {
  box.classList.toggle("highlight");
});
