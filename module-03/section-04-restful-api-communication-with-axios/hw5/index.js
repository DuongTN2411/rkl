import axios from "axios";

const BASE_URL = "http://localhost:3004/contacts";

async function getContacts() {
  const res = await axios.get(BASE_URL);
  console.log(res.data);
}

async function addContact(contact) {
  const res = await axios.post(BASE_URL, contact);
  console.log(res.data);
}

async function deleteContact(id) {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    console.log(`Đã xóa contact ${id}`);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.log("Không tìm thấy contact");
    } else {
      console.log(err.message);
    }
  }
}

getContacts();
addContact({ name: "David", phone: "0934567890" });
deleteContact(999);
