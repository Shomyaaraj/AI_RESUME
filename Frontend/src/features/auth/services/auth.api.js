import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});

export async function register({ username, email, password }) {
    try {
        const response = await api.post("/api/auth/register", {
            username,
            email,
            password,
        });
        return response.data;
    } catch (err) {
        console.error("Register error:", err);
        throw err.response?.data?.message || "Registration failed";
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login", {
            email,
            password
        });
        return response.data;
    } catch (err) {
        console.error("Login error:", err);
        throw err.response?.data?.message || "Login failed";
    }
}

export async function logout() {
    try {
        const response = await api.get("/api/auth/logout");
        return response.data;
    } catch (err) {
        console.error("Logout error:", err);
        throw err.response?.data?.message || "Logout failed";
    }
}

export async function getMe() {
    try {
        const response = await api.get("/api/auth/get-me");
        return response.data;
    } catch (err) {
        console.error("Get me error:", err);
        return null;
    }
}