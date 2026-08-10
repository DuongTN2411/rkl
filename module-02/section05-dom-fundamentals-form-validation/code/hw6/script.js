let list = document.getElementById("item-list");
let btnAdd = document.getElementById("btn-add");
let btnRemove = document.getElementById("btn-remove");

btnAdd.addEventListener("click", function() {
  let li = document.createElement("li");
  li.innerText = "New Item";
  list.appendChild(li);
});

btnRemove.addEventListener("click", function() {
  let lastItem = list.lastElementChild;
  if (lastItem) {
    lastItem.remove();
  }
});
