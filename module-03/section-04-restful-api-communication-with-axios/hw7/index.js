import axios from "axios";

const ACCESS_TOKEN = "my-secret-token";

axios.interceptors.request.use((config) => {
  const token = ACCESS_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.get("http://localhost:3004/contacts").then((res) => {
  console.log(res.data);
});
