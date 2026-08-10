let form = document.getElementById("register-form");

form.addEventListener("submit", function(e) {
  e.preventDefault();
  let username = document.getElementById("username").value;
  let email = document.getElementById("email").value;
  console.log({ username: username, email: email });
});
