import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const apiService = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token to headers
apiService.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Response interceptor for handling global errors, e.g., 401 Unauthorized
apiService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Here you could implement a global logout mechanism
      console.log('Unauthorized request. User should be logged out.');
      // For example, by clearing the token and redirecting to login
      SecureStore.deleteItemAsync('authToken');
      // Note: Navigation should be handled within a component or context, not here.
    }
    return Promise.reject(error);
  }
);

export default apiService;
