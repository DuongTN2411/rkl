let tasks = [];

function addTask(title) {
  tasks.push(title);
}

function removeTask(index) {
  tasks.splice(index, 1);
}

function displayTasks() {
  tasks.forEach(function (task, index) {
    console.log(index + 1 + ". " + task);
  });
}

addTask("Học JavaScript");
addTask("Làm bài tập");
addTask("Ôn tập bài cũ");
removeTask(1);
displayTasks();
