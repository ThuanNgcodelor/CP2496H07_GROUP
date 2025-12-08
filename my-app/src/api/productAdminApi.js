import createApiInstance from "./createApiInstance";
const API_URL = "/v1";
const api = createApiInstance(API_URL);


const toMultipart = (requestObj, file) => {
    const fd = new FormData();
    fd.append(
        "request",
        new Blob([JSON.stringify(requestObj)], { type: "application/json" })
    );
    if (file) fd.append("file", file);
    return fd;
};


const productAdminApi = {
    async list() {
        const res = await api.get("/stock/product/list");
        return res.data;
    },


    async page({ pageNo = 1, pageSize = 10 } = {}) {
        const res = await api.get("/stock/product/page", { params: { pageNo, pageSize } });
        return res.data;
    },


    async create(request, file) {
        const res = await api.post(
            "/stock/product/create",
            toMultipart(request, file),
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return res.data;
    },


    async update(request, file) {
        const res = await api.put(
            "/stock/product/update",
            toMultipart(request, file),
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return res.data;
    },


    async remove(id) {
        await api.delete(`/stock/category/deleteCategoryById/${id}`);
    },


    async getById(id) {
        const res = await api.get(`/stock/product/getProductById/${id}`);
        return res.data;
    }
    ,


    async search(keyword, pageNo = 1) {
        const res = await api.get("/stock/product/search", { params: { keyword, pageNo } });
        return res.data; // Spring Page<ProductDto>
    }
};


export default productAdminApi;