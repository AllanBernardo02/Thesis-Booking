import axios from "axios";
// const API = axios.create({ baseURL: "http://localhost:5000" });
// API.interceptors.request.use((req) => {
//   if (localStorage.getItem("profile")) {
//     req.headers.Authorization = `Bearer ${
//       JSON.parse(localStorage.getItem("profile")).token
//     }`;
//   }

//   return req;
// });
const BASE_URL = "https://starwheal.onrender.com/api";
// const BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const createChat = (data) => api.post("/chat", data);

export const userChats = (id) => api.get(`/chat/${id}`);

export const findChat = (firstId, secondId) =>
  api.get(`/chat/find/${firstId}/${secondId}`);

export const getUser = (userId) =>
  api.get(`/chat/get/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
