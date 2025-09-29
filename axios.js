import axios from "axios";


export const api = axios.create({
baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});


api.interceptors.request.use((config) => {
const token = localStorage.getItem("token");
if (token) config.headers.Authorization = `Bearer ${token}`;
return config;
});


api.interceptors.response.use(
(res) => res,
(err) => {
if (err?.response?.status === 401) {
// token invalid/expired -> logout client-side
localStorage.removeItem("token");
window.location.href = "/login";
}
return Promise.reject(err);
}
);