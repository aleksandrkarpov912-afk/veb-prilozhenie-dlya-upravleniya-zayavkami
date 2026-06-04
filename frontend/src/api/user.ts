import api from './axios';

export const getMe = () => api.get('/user/me');

export const updateProfile = (data: {
  name?: string;
  email?: string;
  password?: string;
}) => api.patch('/user/profile', data);