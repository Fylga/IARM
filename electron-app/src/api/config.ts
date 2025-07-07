export const API_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:8000/api'
  : 'https://your-production-api.com/api';

export const API_TIMEOUT = 10000; 

export const API_CONFIG = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
};
