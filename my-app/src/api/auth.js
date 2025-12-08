import Cookies from "js-cookie";
import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/auth";
const api = createApiInstance(API_URL);

/**
 * Gửi yêu cầu quên mật khẩu
 * @param {string} email - Email của người dùng
 * @returns {Promise} - Promise trả về kết quả gửi email
 */
export const forgotPassword = (email) =>
    api.post("/forgotPassword", { email });

/**
 * Xác thực OTP
 * @param {string} email - Email của người dùng
 * @param {string} otp - Mã OTP
 * @returns {Promise} - Promise trả về kết quả xác thực
 */
export const verifyOtp = (email, otp) =>
    api.post("/verifyOtp", { email, otp });

/**
 * Cập nhật mật khẩu mới
 * @param {string} email - Email của người dùng
 * @param {string} newPassword - Mật khẩu mới
 * @returns {Promise} - Promise trả về kết quả cập nhật
 */
export const updatePassword = (email, newPassword) =>
    api.post("/updatePassword", { email, newPassword });

/**
 * Đăng nhập
 * @param {Object} data - Dữ liệu đăng nhập { email/username, password }
 * @returns {Promise} - Promise trả về thông tin người dùng và token
 */
export const login = async (data) => {
    const response = await api.post("/login", data);
    const { token } = response.data;
    Cookies.set("accessToken", token, { expires: 7 });
    return response.data;
};

/**
 * Đăng ký tài khoản mới
 * @param {Object} data - Dữ liệu đăng ký
 * @returns {Promise} - Promise trả về thông tin tài khoản đã tạo
 */
export const register = async (data) => {
    const response = await api.post("/register", data);
    return response.data;
};

/**
 * Lấy token từ cookie
 * @returns {string|null} - Token hoặc null nếu không có
 */
export const getToken = () => {
    return Cookies.get("accessToken") || null;
};

/**
 * Đăng xuất (xóa token)
 */
export const logout = () => {
    Cookies.remove("accessToken");
};

/**
 * Lấy danh sách role từ token
 * @returns {string[]} - Mảng các role của người dùng
 */
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
        return [];
    }
};

/**
 * Kiểm tra người dùng đã đăng nhập chưa
 * @returns {boolean} - True nếu đã đăng nhập
 */
export const isAuthenticated = () => {
    return !!getToken();
};
