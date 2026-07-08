import api from "../api/api";

export const getDashboard = async () => {

    const response = await api.get("/Dashboard");

    return response.data;

};

export const getLatestDebts = async () => {

    const response = await api.get("/Dashboard/latest-debts");

    return response.data;

};

export const getDueAlerts = async () => {

    const response = await api.get("/Dashboard/due-alerts");

    return response.data;

};