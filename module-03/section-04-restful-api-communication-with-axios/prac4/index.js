import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3004",
  timeout: 3000,
});

apiClient.get("/products").then((res) => {
  console.log(res.data);
});
