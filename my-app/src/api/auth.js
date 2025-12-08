import Cookies from "js-cookie";
import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/auth";

const api = createApiInstance(API_URL);

export const forgotPassword = (email) =>
    api.post("/forgotPassword", { email });

export const verifyOtp = (email, otp) =>
    api.post("/verifyOtp", { email, otp });

export const updatePassword = (email, newPassword) =>
    api.post("/updatePassword", { email, newPassword });

export const login = async (data) => {
     const response = await api.post("/login", data);
     const { token } = response.data;
     Cookies.set("accessToken", token, { expires: 7 });
     return response.data;
};

export const register = async (data) => {
     const response = await api.post("/register", data);
     return response.data;
};

export const getToken = () => {
    return Cookies.get("accessToken") || null;
};

export const logout = () => {
    Cookies.remove("accessToken");
};

export const getUserRole = () => {
    const token = getToken();
    if (!token) return [];

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        let roles = [];
        if (Array.isArray(payload.roles)) {
            roles = payload.roles;
        } else if (Array.isArray(payload.authorities)) {
            roles = payload.authorities;
        } else if (payload.role) {
            roles = [payload.role];
        }

        const normalized = [...new Set(
            roles
                .filter(Boolean)
                .map(String)
                .map(r => r.startsWith('ROLE_') ? r : `ROLE_${r.toUpperCase()}`)
        )];

        return normalized;
    } catch (error) {
        console.error("Error decoding token:", error);
        return [];
    }
};

export const isAuthenticated = () => {
    return !!getToken();
};