import api from "../api/api";

export const getCustomers = async () => {

    const response = await api.get("/Customer");

    return response.data;

};

export const getCustomerById = async (id) => {

    const response = await api.get(`/Customer/${id}`);

    return response.data;

};

export const addCustomer = async (customer) => {

    const response = await api.post("/Customer", customer);

    return response.data;

};

export const updateCustomer = async (id, customer) => {

    const response = await api.put(`/Customer/${id}`, customer);

    return response.data;

};

export const deleteCustomer = async (id) => {

    const response = await api.delete(`/Customer/${id}`);

    return response.data;

};

export const searchCustomer = async (keyword) => {

    const response = await api.get(`/Customer/search?name=${keyword}`);

    return response.data;

};