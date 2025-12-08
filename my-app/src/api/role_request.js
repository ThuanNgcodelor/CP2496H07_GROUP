import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/user/role-requests";
const api = createApiInstance(API_URL);

/**
 * Lấy danh sách các yêu cầu role đang chờ duyệt (Admin only)
 * @returns {Promise<Array>} - Promise trả về danh sách yêu cầu
 */
export const getPendingRequests = async () => {
    try {
        const response = await api.get("/pending");
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch pending requests");
    }
};

/**
 * Duyệt yêu cầu role (Admin only)
 * @param {string} id - ID của yêu cầu
 * @param {string} adminNote - Ghi chú của admin (mặc định: '')
 * @returns {Promise} - Promise trả về kết quả duyệt
 */
export async function approveRequest(id, adminNote = '') {
    try {
        const response = await api.post(`/${id}/approve`, null, {
            params: { adminNote }
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to approve request");
    }
}

/**
 * Từ chối yêu cầu role (Admin only)
 * @param {string} id - ID của yêu cầu
 * @param {string} rejectionReason - Lý do từ chối
 * @returns {Promise} - Promise trả về kết quả từ chối
 */
export async function rejectRequest(id, rejectionReason) {
    try {
        const response = await api.post(`/${id}/reject`, null, {
            params: { rejectionReason }
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to reject request");
    }
}

/**
 * Lấy thông tin yêu cầu role theo ID
 * @param {string} id - ID của yêu cầu
 * @returns {Promise} - Promise trả về thông tin yêu cầu
 */
export const getRoleRequestById = async (id) => {
    try {
        const response = await api.get(`/${id}`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch role request");
    }
};
