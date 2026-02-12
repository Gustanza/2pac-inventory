// Centralized API configuration and axios instance
import axios from 'axios';

export const API_BASE_URL = '/api'; // TODO: adjust base URL when backend details are known

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Placeholder endpoint paths. Do NOT encode business logic here.
export const endpoints = {
  login: '/auth/login', // TODO: confirm with backend
  register: '/auth/register', // TODO: confirm with backend
  shops: '/shops',
  products: '/products',
  stockAdd: '/stock/add',
  stockSell: '/stock/sell',
  stockHistory: '/stock/history',
  // TODO: add/adjust endpoints when backend contract is defined
};



