import axios from "axios";

const API_URL = "http://192.168.0.88:8080/api/auth/";

const login = async (username, password) => {
    const response = await axios.post(API_URL + "login", {
        username,
        password
    });
    
    if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userRole", response.data.role);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("displayName", response.data.displayName);
    }
    
    return response.data;
};

const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("displayName");
};

const getCurrentUser = () => {
    return {
        token: localStorage.getItem("authToken"),
        role: localStorage.getItem("userRole"),
        username: localStorage.getItem("username"),
        displayName: localStorage.getItem("displayName")
    };
};

const isAuthenticated = () => {
    return !!localStorage.getItem("authToken");
};

const hasRole = (role) => {
    const userRole = localStorage.getItem("userRole");
    return userRole === role;
};

const isAdmin = () => {
    return hasRole("Admin");
};

const isUser = () => {
    const userRole = localStorage.getItem("userRole");
    return userRole === "User" || userRole === "Admin";
};

const exportedObject = {
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
    hasRole,
    isAdmin,
    isUser
};

export default exportedObject;
