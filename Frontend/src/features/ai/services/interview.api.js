import { api } from "../../auth/services/auth.api";

export async function generateReport({ jobDescription, resume, selfDescription }) {
    try {
        const response = await api.post("/api/interview/generate", {
            jobDescription,
            resume,
            selfDescription
        });
        return response.data;
    } catch (err) {
        console.error("Generate report error:", err);
        throw err.response?.data?.message || "Failed to generate interview report";
    }
}

export async function getUserReports() {
    try {
        const response = await api.get("/api/interview/reports");
        return response.data;
    } catch (err) {
        console.error("Get user reports error:", err);
        throw err.response?.data?.message || "Failed to fetch reports";
    }
}

export async function getReportById(id) {
    try {
        const response = await api.get(`/api/interview/reports/${id}`);
        return response.data;
    } catch (err) {
        console.error("Get report by ID error:", err);
        throw err.response?.data?.message || "Failed to fetch report details";
    }
}

export async function deleteReport(id) {
    try {
        const response = await api.get(`/api/interview/reports/${id}`);
        const res = await api.delete(`/api/interview/reports/${id}`);
        return res.data;
    } catch (err) {
        console.error("Delete report error:", err);
        throw err.response?.data?.message || "Failed to delete report";
    }
}
