import axios from "axios";
import config from "./config";

const api = axios.create({ baseURL: config.BASE_URL });

api.interceptors.request.use((request) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    request.headers = request.headers || {};
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

export default api;
