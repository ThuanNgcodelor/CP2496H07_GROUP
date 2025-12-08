import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../config/config.js";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const t = Cookies.get("accessToken");
    if (t) config.headers.Authorization = `Bearer ${t}`;
    return config;
});

export default api;
