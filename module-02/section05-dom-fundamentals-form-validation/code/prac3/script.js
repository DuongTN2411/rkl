let btn = document.getElementById("btn-change");
let img = document.getElementById("my-image");

btn.addEventListener("click", function () {
  let currentSrc = img.getAttribute("src");
  console.log("Ảnh hiện tại:", currentSrc);
  img.setAttribute("src", "./2.jpg");
});
