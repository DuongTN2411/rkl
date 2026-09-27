import axios from "axios";

axios
  .post("https://api.example.com/api/users", {
    name: "Alice",
    email: "alice@example.com",
  })
  .then((res) => {
    console.log(res.status);
    console.log(res.data.id);
    if (res.status >= 200 && res.status < 300) {
      console.log("Tạo thành công");
    }
  })
  .catch((err) => {
    console.log(err.message);
  });
