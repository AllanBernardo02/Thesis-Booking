import axios from "axios";

const BASE_URL = "https://starwheal.onrender.com/api";
// const BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// const API = axios.create({ baseURL: "http://localhost:5000" });

export const getMessages = (id) => api.get(`/message/${id}`);

export const addMessage = (data) => api.post("/message", data);
