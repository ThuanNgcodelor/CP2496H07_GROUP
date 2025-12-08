import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/order";

const api = createApiInstance(API_URL);

// Get user addresses
export const getUserAddresses = async () => {
    try {
        const response = await api.get("/addresses");
        return response.data;
    } catch (error) {
        console.error("Error fetching addresses:", error);
        throw new Error("Failed to fetch addresses");
    }
};

// Get address by ID
export const getAddressById = async (addressId) => {
    try {
        const response = await api.get(`/addresses/${addressId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching address:", error);
        throw new Error("Failed to fetch address");
    }
};

export const getOrdersByUser = async () => {
    try {
        const response = await api.get("/getOrderByUserId");
        return response.data;
    } catch {
        throw new Error("Failed to fetch orders");
    }
};


// Create order from cart
export const createOrder = async (orderData) => {
    try {
        const response = await api.post("/create-from-cart", orderData);
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        
        const errorData = error.response?.data;
        if (errorData) {
            throw {
                type: errorData.error || 'ORDER_FAILED',
                message: errorData.message || 'Failed to create order',
                details: errorData.details || null
            };
        }
        
        throw {
            type: 'NETWORK_ERROR',
            message: 'Network error occurred. Please try again.',
            details: null
        };
    }
};

// Get user orders
export const getUserOrders = async () => {
    try {
        const response = await api.get("/user-orders");
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Failed to fetch orders");
    }
};

// Get order by ID
export const getOrderById = async (orderId) => {
    try {
        const response = await api.get(`/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching order:", error);
        throw new Error("Failed to fetch order");
    }
};


export const getAllOrders = async () => {
    try {
        const response = await api.get("/getAll");
        console.log(response.data);
        return response.data;
    } catch {
        throw new Error("Failed to fetch cart data");
    }
}

export async function updateOrderStatus(id) {
    const { data } = await api.put(`update-status/${id}?status=PROCESSING`);
    return data;
}

// Cancel order by user
export const cancelOrder = async (orderId) => {
    try {
        const response = await api.put(`/cancel/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error cancelling order:", error);
        throw new Error(error.response?.data?.message || "Failed to cancel order");
    }
};

// Shop Owner Order APIs
export const getShopOwnerOrders = async (status = null, pageNo = 1, pageSize = 10) => {
    try {
        const params = { pageNo, pageSize };
        if (status) {
            params.status = status;
        }
        const response = await api.get("/shop-owner/orders", { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching shop owner orders:", error);
        throw new Error("Failed to fetch shop owner orders");
    }
};

export const getAllShopOwnerOrders = async (status = null) => {
    try {
        const params = status ? { status } : {};
        const response = await api.get("/shop-owner/orders/all", { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching all shop owner orders:", error);
        throw new Error("Failed to fetch all shop owner orders");
    }
};

export const getShopOwnerOrderById = async (orderId) => {
    try {
        const response = await api.get(`/shop-owner/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching shop owner order:", error);
        throw new Error("Failed to fetch shop owner order");
    }
};

export const updateOrderStatusForShopOwner = async (orderId, status) => {
    try {
        const response = await api.put(`/shop-owner/orders/${orderId}/status?status=${encodeURIComponent(status)}`);
        return response.data;
    } catch (error) {
        console.error("Error updating order status:", error);
        throw new Error("Failed to update order status");
    }
};

// Calculate shipping fee before checkout
export const calculateShippingFee = async (addressId, selectedItems) => {
    try {
        // Calculate total weight and quantity
        const totalQuantity = selectedItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const totalWeight = totalQuantity * 500; // 500g per item
        
        // Get first product ID to get shop owner
        const firstProductId = selectedItems.length > 0 ? (selectedItems[0].productId || selectedItems[0].id) : null;
        
        const requestData = {
            addressId: addressId,
            weight: totalWeight,
            quantity: totalQuantity,
            productId: firstProductId
        };
        
        const response = await api.post("/calculate-shipping-fee", requestData);
        return response.data;
    } catch (error) {
        console.error("Error calculating shipping fee:", error);
        // Return null if calculation fails (don't block checkout)
        return null;
    }
};