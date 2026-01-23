import axios from 'axios';
const BASE_URL = 'http://localhost:5000'; 

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (originalRequest.url.includes('/refresh')) {
        return Promise.reject(error);
    }

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      
      originalRequest._retry = true

      try {
        const response = await axios.get(`${BASE_URL}/refresh`, {
          withCredentials: true 
        });

        const { accessToken } = response.data

        localStorage.setItem('token', accessToken)
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        
        return api(originalRequest);

      } catch (refreshError) {
        console.log("Session expired completely.");
        
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo')

        if (window.location.pathname !== '/') {
            window.location.href = '/';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;