import axios from 'axios';

// Make sure the baseURL matches your backend's actual URL and port
const API = axios.create({
  baseURL: 'http://localhost:8000/api/Users/', // Use 127.0.0.1 for better compatibility
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
// This code sets up an Axios instance for making API requests to a backend server.
// It includes an interceptor to add an Authorization header with a token from localStorage if it exists
// This allows for authenticated requests to be made to the API endpoints.