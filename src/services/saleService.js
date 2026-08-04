import api from "../api/api";

export const getSales = async () => {
    const response = await api.get("/Sale");
    return response.data;
};

export const getSaleById = async (id) => {
    const response = await api.get(`/Sale/${id}`);
    return response.data;
};

export const getCashSales = async () => {
    const response = await api.get("/Sale/cash");
    return response.data;
};

export const getCreditSales = async () => {
    const response = await api.get("/Sale/credit");
    return response.data;
};

export const getTodaySales = async () => {
    const response = await api.get("/Sale/today");
    return response.data;
};

export const createSale = async (saleData) => {
    const response = await api.post("/Sale", saleData);
    return response.data;
};

export const getCustomerCreditSales = async (customerId) => {
    const response = await api.get(`/Sale/customer/${customerId}`);
    return response.data;
};

export const updateSale = async (id, saleData) => {
    const response = await api.put(`/Sale/${id}`, saleData);
    return response.data;
};