import React, { useState } from "react";

function SmartCounter() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(count + 1);
  }

  function decrement() {
    if (count > 0) {
      setCount(count - 1);
    }
  }

  function reset() {
    setCount(0);
  }

  return (
    <div>
      <span id="count">{count}</span>
      <button onClick={increment}>Tăng</button>
      <button onClick={decrement}>Giảm</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default SmartCounter;
