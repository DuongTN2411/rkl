function simulateTask() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Task Completed!");
    }, 2000);
  });
}

async function runTask() {
  try {
    const result = await simulateTask();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

runTask();
