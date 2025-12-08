import createApiInstance from "./createApiInstance";

const API_URL = "/v1";
const api = createApiInstance(API_URL);

/**
 * Lấy danh sách bình luận của sản phẩm (có nested replies)
 * @param {string} productId - ID của sản phẩm
 * @returns {Promise<Array>} - Promise trả về danh sách bình luận
 */
export async function listProductComments(productId) {
    const res = await api.get(`/stock/product/${productId}/comments`);
    return res.data;
}

/**
 * Thêm bình luận mới cho sản phẩm
 * @param {string} productId - ID của sản phẩm
 * @param {Object} data - Dữ liệu bình luận { content, rating }
 * @returns {Promise} - Promise trả về bình luận đã tạo
 */
export async function addProductComment(productId, { content, rating }) {
    const res = await api.post(`/stock/product/${productId}/comments`, { content, rating });
    return res.data;
}

/**
 * Trả lời một bình luận
 * @param {string} productId - ID của sản phẩm
 * @param {string} commentId - ID của bình luận cần trả lời
 * @param {Object} data - Dữ liệu trả lời { content }
 * @returns {Promise} - Promise trả về reply đã tạo
 */
export async function replyProductComment(productId, commentId, { content }) {
    const res = await api.post(`/stock/product/${productId}/comments/${commentId}/reply`, { content });
    return res.data;
}

/**
 * Xóa bình luận (chỉ chủ sở hữu mới được xóa)
 * @param {string} commentId - ID của bình luận cần xóa
 * @returns {Promise} - Promise trả về kết quả xóa
 */
export async function deleteProductComment(commentId) {
    await api.delete(`/stock/comments/${commentId}`);
}
