import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// =====================
// AUTH API
// =====================
export const authAPI = {
  login: (email, password) =>
    apiClient.post("/auth/login", { email, password }),
  logout: () => apiClient.post("/auth/logout"),
};

// =====================
// USER API
// =====================
export const userAPI = {
  getAll: () => apiClient.get("/users"),
  getById: (id) => apiClient.get(`/users/${id}`),
  create: (data) => apiClient.post("/users", data),
  update: (id, data) => apiClient.put(`/users/${id}`, data),
  delete: (id) => apiClient.delete(`/users/${id}`),
};

// =====================
// TASK API
// =====================
export const taskAPI = {
  getAll: () => apiClient.get("/tasks"),
  getById: (id) => apiClient.get(`/tasks/${id}`),
  create: (data) => apiClient.post("/tasks", data),
  update: (id, data) => apiClient.put(`/tasks/${id}`, data),
  updateStatus: (id, status) =>
    apiClient.patch(`/tasks/${id}/status`, { status }),
  delete: (id) => apiClient.delete(`/tasks/${id}`),
};

export default apiClient;
