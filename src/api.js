import axios from "axios";

export const BASE_URL = "https://ecommerce-backend-bbic.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
