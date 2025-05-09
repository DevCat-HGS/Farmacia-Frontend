import axios from 'axios';

const API_URL = 'http://172.23.235.78:5000/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const categoryApi = {
  getAll: () => api.get('/api/categories'),
  create: (data) => api.post('/api/categories', data),
  update: (id, data) => api.put(`/api/categories/${id}`, data),
  delete: (id) => api.delete(`/api/categories/${id}`),
};

export const productApi = {
  getAll: () => api.get('/api/products'),
  create: (data) => api.post('/api/products', data),
  update: (id, data) => api.put(`/api/products/${id}`, data),
  delete: (id) => api.delete(`/api/products/${id}`),
};

export const batchApi = {
  getAll: () => api.get('/api/batchs'),
  create: (data) => api.post('/api/batchs', data),
  update: (id, data) => api.put(`/api/batchs/${id}`, data),
  delete: (id) => api.delete(`/api/batchs/${id}`),
};

export const inputApi = {
  getAll: () => api.get('/api/inputs'),
  create: (data) => api.post('/api/inputs', data),
  update: (id, data) => api.put(`/api/inputs/${id}`, data),
  delete: (id) => api.delete(`/api/inputs/${id}`),
};

export const outputApi = {
  getAll: () => api.get('/api/outputs'),
  create: (data) => api.post('/api/outputs', data),
  update: (id, data) => api.put(`/api/outputs/${id}`, data),
  delete: (id) => api.delete(`/api/outputs/${id}`),
};