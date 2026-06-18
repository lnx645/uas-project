import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("__auth"); 
        
        if (token && token !== "null" && token !== "undefined" && token.trim() !== "") {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;