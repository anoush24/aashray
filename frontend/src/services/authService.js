import api from './api';

export const authService = {
  loginUser: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  loginHospital: async (credentials) => {
    const response = await api.post('/hospital/login', credentials);
    return response.data;
  },

  registerUser: async (data) => {
    const response = await api.post('/users/register', data);
    return response.data;
  },
  
  registerHospital: async (data) => {
    const response = api.post('/hospital/register', data);
    return (await response).data;
  }
};