import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1";
const api = createApiInstance(API_URL);

export const fetchProducts = () => {
    return api.get("/stock/product/list");
};

export const fetchProductsPage = (pageNo = 1, pageSize = 6) => {
    return api.get(`/stock/product/listPage?pageNo=${pageNo}&pageSize=${pageSize}`);
};

export const searchProducts = (keyword = "", pageNo = 1, pageSize = 6) => {
    return api.get(`/stock/product/search?keyword=${encodeURIComponent(keyword)}&pageNo=${pageNo}&pageSize=${pageSize}`);
};


export const removeCartItem = async (cartItemId) => {
    try {
      await api.delete(`/stock/cart/item/remove/${cartItemId}`);
      return true;
    } catch (error) {
      console.error("Failed to remove cart item:", error);
      return false;
    }
  }

export const fetchProductById = (productId) => {
    return api.get(`/stock/product/getProductById/${productId}`);
}

export const fetchProductImageById = (imageId) => {
    return api.get(`/file-storage/get/${imageId}`, {
        responseType: "arraybuffer",
    });
}

export const fetchAddToCart = async (data) => {
    try{    
        const response = await api.post(`/stock/cart/item/add`, data);
        return response.data;
    }catch(err){
        throw err;
    }
}

export const updateCartItemQuantity = async (data) => {
    try{    
        const response = await api.put(`/stock/cart/item/update`, data);
        return response.data;
    }catch(err){
        throw err;
    }
}