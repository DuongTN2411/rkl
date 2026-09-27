import axios from "axios";

const BASE_URL = "http://localhost:3004/users";

const user = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  phone: "0901234567",
  address: "Hanoi",
};

async function updateUserPut(id, data) {
  const res = await axios.put(`${BASE_URL}/${id}`, data);
  console.log(res.data);
}

async function updateUserPatch(id, data) {
  const res = await axios.patch(`${BASE_URL}/${id}`, data);
  console.log(res.data);
}

updateUserPut(1, { ...user, phone: "0999999999" });
updateUserPatch(1, { phone: "0999999999" });
