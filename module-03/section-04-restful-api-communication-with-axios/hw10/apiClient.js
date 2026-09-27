import axios from "axios";

const ACCESS_TOKEN = "my-secret-token";

const apiClient = axios.create({
  baseURL: "http://localhost:3004",
  timeout: 5000,
});

apiClient.interceptors.request.use((config) => {
  const token = ACCESS_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (err) => {
    if (err.response) {
      if (err.response.status === 401) {
        console.log("Unauthorized");
      } else if (err.response.status === 500) {
        console.log("Server error");
      }
    }
    return Promise.reject(err);
  }
);

export function get(url, params) {
  const cleanParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined)
      )
    : undefined;
  return apiClient.get(url, { params: cleanParams });
}

export function post(url, data) {
  return apiClient.post(url, data);
}

export function put(url, data) {
  return apiClient.put(url, data);
}

export function remove(url) {
  return apiClient.delete(url);
}
