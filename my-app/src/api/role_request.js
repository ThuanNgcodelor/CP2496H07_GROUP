import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/user/role-requests";

const api = createApiInstance(API_URL);


// Admin APIs
export const getPendingRequests = async () => {
    try {
        const response = await api.get("/pending");
        return response.data;
    } catch (error) {
        console.error("Error fetching pending requests:", error);
        throw new Error("Failed to fetch pending requests");
    }
}

export async function approveRequest(id, adminNote = '') {
    try {
        const response = await api.post(`/${id}/approve`, null, {
            params: { adminNote }
        });
        return response.data;
    } catch (error) {
        console.error("Error approving request:", error);
        throw new Error("Failed to approve request");
    }
}

export async function rejectRequest(id, rejectionReason) {
    try {
        const response = await api.post(`/${id}/reject`, null, {
            params: { rejectionReason }
        });
        return response.data;
    } catch (error) {
        console.error("Error rejecting request:", error);
        throw new Error("Failed to reject request");
    }
}

// User API
export const getRoleRequestById = async (id) => {
    try {
        const response = await api.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching role request:", error);
        throw new Error("Failed to fetch role request");
    }
}
