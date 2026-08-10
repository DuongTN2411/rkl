let scores = [1, 2, 3, 4, 5];

console.log("Bình phương từng phần tử:");
scores.forEach(function(score) {
  console.log(score * score);
});

let doubledScores = scores.map(function(score) {
  return score * 2;
});

console.log("Mảng doubledScores:", doubledScores);
