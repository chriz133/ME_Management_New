import axios from "axios";

const instance = axios.create({
    baseURL: "http://192.168.0.88:8080/",
    headers: {
        "Content-type": "application/json"
    }
});

// Add a request interceptor to include the Authorization header
instance.interceptors.request.use(
    (config) => {
        // Get the token from localStorage
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid - redirect to login
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('username');
            // Only redirect if not already on login page
            if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
                window.location.href = '/#/login';
            }
        }
        return Promise.reject(error);
    }
);

export default instance;