import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    API.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    API.post('/auth/login', data),
};

// Properties APIs
export const propertiesAPI = {
  getAll: (params?: any) => API.get('/properties', { params }),
  getById: (id: string) => API.get(`/properties/${id}`),
  create: (data: any) => API.post('/properties', data),
  update: (id: string, data: any) => API.put(`/properties/${id}`, data),
  delete: (id: string) => API.delete(`/properties/${id}`),
};

// Users APIs
export const usersAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data: any) => API.put('/users', data),
  getById: (id: string) => API.get(`/users/${id}`),
};

export default API;
