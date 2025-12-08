import createApiInstance from "./createApiInstance";
const API_URL = "/v1";
const api = createApiInstance(API_URL);

// List comments for a product (nested replies)
export async function listProductComments(productId) {
  const res = await api.get(`/stock/product/${productId}/comments`);
  return res.data;
}

// Add a new top-level comment
export async function addProductComment(productId, { content, rating }) {
  const res = await api.post(`/stock/product/${productId}/comments`, { content, rating });
  return res.data;
}

// Reply to a comment
export async function replyProductComment(productId, commentId, { content }) {
  const res = await api.post(`/stock/product/${productId}/comments/${commentId}/reply`, { content });
  return res.data;
}

// Delete a comment (owner-only)
export async function deleteProductComment(commentId) {
  await api.delete(`/stock/comments/${commentId}`);
}
