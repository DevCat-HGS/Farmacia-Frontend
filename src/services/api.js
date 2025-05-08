import axios from 'axios';

const API_URL = 'https://farmacia-admin-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const categoryApi = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const productApi = {
  getAll: () => api.get('/products'),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const batchApi = {
  getAll: () => api.get('/batchs'),
  create: (data) => api.post('/batchs', data),
  update: (id, data) => api.put(`/batchs/${id}`, data),
  delete: (id) => api.delete(`/batchs/${id}`),
};

export const inputApi = {
  getAll: () => api.get('/inputs'),
  create: (data) => api.post('/inputs', data),
  update: (id, data) => api.put(`/inputs/${id}`, data),
  delete: (id) => api.delete(`/inputs/${id}`),
};

export const outputApi = {
  getAll: () => api.get('/outputs'),
  create: (data) => api.post('/outputs', data),
  update: (id, data) => api.put(`/outputs/${id}`, data),
  delete: (id) => api.delete(`/outputs/${id}`),
}; 