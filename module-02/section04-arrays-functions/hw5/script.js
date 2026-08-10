let numbers = [10, 20, 30, 40, 50];

function checkNumber(searchValue) {
  if (numbers.includes(searchValue)) {
    let index = numbers.indexOf(searchValue);
    console.log("Tìm thấy " + searchValue + " tại vị trí index: " + index);
  } else {
    console.log("Not found");
  }
}

checkNumber(30);
checkNumber(99);
