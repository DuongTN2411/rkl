import { useState } from "react";

export default function App() {
  const [formState, setFormState] = useState({
    email: "",
    fullName: "",
    phone: "",
    address: "",
    city: "",
  });

  function handleChange(event) {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(formState);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={formState.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="fullName"
        value={formState.fullName}
        onChange={handleChange}
        placeholder="Full Name"
      />
      <input
        name="phone"
        value={formState.phone}
        onChange={handleChange}
        placeholder="Phone"
      />
      <input
        name="address"
        value={formState.address}
        onChange={handleChange}
        placeholder="Address"
      />
      <input
        name="city"
        value={formState.city}
        onChange={handleChange}
        placeholder="City"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
