import api from "../api/api";

export const getReport = async () => {

    const response = await api.get("/Reports");

    return response.data;

};