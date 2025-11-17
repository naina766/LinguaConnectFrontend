import axios from "axios";

const api = axios.create({
  baseURL: "https://linguaconnect-hackathon.onrender.com", // your backend URL
  withCredentials: true,
});

export default api;
