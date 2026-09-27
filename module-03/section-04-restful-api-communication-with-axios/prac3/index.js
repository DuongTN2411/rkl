import axios from "axios";

async function login(email, password) {
  try {
    const res = await axios.post("https://api.example.com/login", {
      email,
      password,
    });
    console.log(res.data);
  } catch (err) {
    if (err.response) {
      console.log("Máy chủ từ chối:", err.response.status);
    } else if (err.request) {
      console.log("Không thể kết nối tới máy chủ");
    } else {
      console.log("Lỗi cấu hình Axios:", err.message);
    }
  }
}

login("user@example.com", "wrongpassword");
