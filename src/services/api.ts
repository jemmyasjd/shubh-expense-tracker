import axios from 'axios';
import { toast } from 'react-hot-toast'; // You'll need to install this package

// Create a variable to store the logout function that will be set later
let logoutHandler: (() => void) | null = null;

// Function to set the logout handler from AuthContext
export const setLogoutFunction = (fn: () => void) => {
  logoutHandler = fn;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Show toast notification
      toast.error('Session timed out. Please log in again.');
      
      // Call logout function if it's available
      if (logoutHandler) {
        logoutHandler();
      } else {
        console.warn('Logout handler not set but received 401 error');
      }
    }
    return Promise.reject(error);
  }
);

export default api;