let parent = document.getElementById("parent");
let childBtn = document.getElementById("child-btn");

parent.addEventListener("click", function() {
  console.log("Parent được click");
});

childBtn.addEventListener("click", function(e) {
  console.log("Child được click");
  e.stopPropagation();
});
