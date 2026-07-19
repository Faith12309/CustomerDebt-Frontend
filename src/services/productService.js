import api from "../api/api";

export const getProducts = async () => {
    const response = await api.get("/Product");
    return response.data;
};

export const getProductById = async (id) => {
    const response = await api.get(`/Product/${id}`);
    return response.data;
};

export const createProduct = async (data) => {
    const response = await api.post("/Product", data);
    return response.data;
};

export const updateProduct = async (id, data) => {
    const response = await api.put(`/Product/${id}`, data);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`/Product/${id}`);
    return response.data;
};

export const restockProduct = async (id, quantity) => {
    const response = await api.post(`/Product/${id}/restock`, {
        quantity,
    });

    return response.data;
};
export const searchProducts = async (keyword) => {
    const response = await api.get(`/Product/search?keyword=${keyword}`);
    return response.data;
};