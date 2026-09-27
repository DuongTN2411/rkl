import React, { useState } from "react";

function CouponInput() {
  const [value, setValue] = useState("");

  function handleChange(e) {
    setValue(e.target.value.toUpperCase());
  }

  return <input value={value} onChange={handleChange} />;
}

export default CouponInput;
