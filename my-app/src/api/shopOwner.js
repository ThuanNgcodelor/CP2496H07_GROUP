import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1";

const api = createApiInstance(API_URL);

export const addProduct = async (productData, images) => {
    try { 
        const formData = new FormData();
        
        formData.append('request', new Blob([JSON.stringify(productData)], {
            type: 'application/json'
        }));
        
        if (images && images.length > 0) {
            images.forEach((image, index) => {
                formData.append('file', image);
            });
        }
        
        const res = await api.post("/stock/product/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error adding product:", error);
        throw new Error(error.response?.data?.message || "Failed to add product");
    }
}

export const updateProduct = async (productData, images) => {
    try { 
        const formData = new FormData();
        
        formData.append('request', new Blob([JSON.stringify(productData)], {
            type: 'application/json'
        }));

        if (images && images.length > 0) {
            images.forEach((image, index) => {
                formData.append('file', image);
            });
        }
        
        const res = await api.put("/stock/product/update", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw new Error(error.response?.data?.message || "Failed to update product");
    }
}

        
export const getProducts = async (pageNo = 1, pageSize = 6) => {
    try {
        const res = await api.get("/stock/product/listPageShopOwner", {
            params: { pageNo, pageSize }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch products");
    }
}

export const searchProducts = async (keyword = '', pageNo = 1, pageSize = 6) => {
    try {
        const res = await api.get("/stock/product/searchShopOwner", {
            params: { keyword, pageNo, pageSize }
        });
        return res.data;
    } catch (error) {
        console.error("Error searching products:", error);
        throw new Error(error.response?.data?.message || "Failed to search products");
    }
}

export const getProductById = async (id) => {
    try {
        const res = await api.get(`/stock/product/getProductById/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching product:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch product");
    }
}

export const deleteProduct = async (id) => {
    try {
        const res = await api.delete(`/stock/product/deleteProductById/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw new Error(error.response?.data?.message || "Failed to delete product");
    }
}