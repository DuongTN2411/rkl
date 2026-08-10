function simulateTask() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Task Completed!");
    }, 2000);
  });
}

simulateTask()
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
