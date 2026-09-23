import axios from "axios";

const api = axios.create({
    baseURL: "https://customerdebtsystem.runasp.net/api"
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// NEW response interceptor catches expired/invalid sessions (401)
// and sends the user back to login instead of leaving them on a
// page with silently-failed, empty data.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            // full page redirect safe to call from outside the React tree,
            // and guarantees a clean reset of app state.
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;