import axios from 'axios';

//const API_URL = 'http://localhost:8080/api/v1';
const API_URL = 'https://paid-parking-system.onrender.com';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const parkingAPI = {
  getAllSpots: () => api.get('/parking-spots'),
  getAvailableSpots: () => api.get('/parking-spots/available'),
  bookSpot: (spotId) => api.post(`/rents/book/${spotId}`),
  getMyActiveRent: () => api.get('/rents/my-active'),
  cancelRent: (rentId) => api.post(`/rents/cancel/${rentId}`),
};

export default api;