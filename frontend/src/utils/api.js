import axios from 'axios';


const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
      });
      
      if (error.response.status === 401) {
        
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      
      console.error('API No Response:', error.request);
    } else {
      
      console.error('API Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;