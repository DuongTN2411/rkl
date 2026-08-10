let buttons = document.querySelectorAll(".btn-delete");

buttons.forEach(function(btn) {
  btn.addEventListener("click", function() {
    btn.parentElement.remove();
  });
});
