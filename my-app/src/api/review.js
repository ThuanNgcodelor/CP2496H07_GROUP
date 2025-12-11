import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1";
const api = createApiInstance(API_URL);

/**
 * Create a new review
 * @param {Object} data - Review data { productId, rating, comment, ... }
 * @returns {Promise}
 */
export const createReview = async (data) => {
    return api.post("/stock/reviews", data);
};

/**
 * Fetch reviews by product ID
 * @param {string} productId
 * @returns {Promise}
 */
export const fetchReviewsByProductId = (productId) => {
    return api.get(`/stock/reviews/product/${productId}`);
};
