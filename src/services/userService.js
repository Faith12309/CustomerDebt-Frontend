import api from "../api/api";

export const getUsers = async () => {
    const response = await api.get("/User");
    return response.data;
};

export const getUserById = async (id) => {
    const response = await api.get(`/User/${id}`);
    return response.data;
};

export const updateUser = async (id, data) => {
    const response = await api.put(`/User/${id}`, data);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/User/${id}`);
    return response.data;
};