import axios from "axios";

const api = axios.create({
  baseURL: "https://ecommerce-backend-bbic.onrender.com",
});

export default api;
