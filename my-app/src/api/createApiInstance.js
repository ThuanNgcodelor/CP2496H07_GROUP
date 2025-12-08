import axios from "axios";
import Cookies from "js-cookie";

const createApiInstance = (baseURL) => {
    const api = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    api.interceptors.request.use(
        (config) => {
            // Danh sách các endpoint auth public - không cần token
            const publicAuthEndpoints = [
                '/login',
                '/register',
                '/forgotPassword',
                '/verifyOtp',
                '/updatePassword',
                '/login/google',
            ];
            
            // Tạo full URL để kiểm tra
            const fullUrl = (baseURL || '') + (config.url || '');
            
            // Kiểm tra xem endpoint có phải là public auth endpoint không
            const isPublicAuthEndpoint = publicAuthEndpoints.some(endpoint => 
                fullUrl.includes(endpoint) || config.url?.includes(endpoint)
            );
            
            // Chỉ thêm token nếu không phải là public auth endpoint
            if (!isPublicAuthEndpoint) {
                const token = Cookies.get("accessToken");
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
            
            if (config.data instanceof FormData) {
                delete config.headers['Content-Type'];
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    const PUBLIC_401_ALLOWLIST = [
        "/stock/product/list",
        "/stock/product/getProductById",
        "/stock/category/getAll",
        "/file-storage/get",
        "/user/verifyOtp",
        "/user/updatePassword",
        "/user/forgotPassword",
        "/user/login",
        "/user/register",
        "/user/login/google",
    ];

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            const status = error?.response?.status;
            if (status === 401) {
                const reqUrl = error?.config?.url || "";
                const isPublicEndpoint = PUBLIC_401_ALLOWLIST.some((p) => reqUrl.includes(p));
                // Thêm các trang auth/forgot password vào danh sách để không redirect
                const onAuthPage = ["/login", "/register", "/auth", "/forgot", "/verify-otp", "/reset-password"].some((p) => window.location.pathname.startsWith(p));

                if (isPublicEndpoint || onAuthPage) {
                    return Promise.reject(error);
                }

                Cookies.remove("accessToken");
                const current = window.location.pathname + window.location.search;
                window.location.href = `/login?from=${encodeURIComponent(current)}`;
                return;
            }
            return Promise.reject(error);
        }
    );

    return api;
};

export default createApiInstance;