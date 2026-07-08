import api from "../api/api";

export const getDebts = async () => {
    const response = await api.get("/Debt");
    return response.data;
};

export const getDebtById = async (id) => {
    const response = await api.get(`/Debt/${id}`);
    return response.data;
};

export const addDebt = async (debt) => {
    const response = await api.post("/Debt", debt);
    return response.data;
};

export const updateDebt = async (id, debt) => {
    const response = await api.put(`/Debt/${id}`, debt);
    return response.data;
};

export const deleteDebt = async (id) => {
    const response = await api.delete(`/Debt/${id}`);
    return response.data;
};

export const searchDebt = async (status) => {
    const response = await api.get(`/Debt/search?status=${status}`);
    return response.data;
};

export const getOverdueDebts = async () => {
    const response = await api.get("/Debt/overdue");
    return response.data;
};

export const payDebt = async (id, paymentAmount) => {

    const response = await api.post(`/Debt/${id}/payment`, {
        paymentAmount
    });

    return response.data;

};