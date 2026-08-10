let ages = [15, 20, 12, 18, 25, 30, 10];

function getAdults(arr) {
  return arr.filter(function(age) {
    return age >= 18;
  });
}

let adults = getAdults(ages);
console.log("Độ tuổi từ 18 trở lên:", adults);
