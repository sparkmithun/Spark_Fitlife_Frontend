import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('spark_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('spark_token');
      localStorage.removeItem('spark_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  resendOtp: (data) => api.post('/auth/resend-otp', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// Users
export const userAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  follow: (id) => api.post(`/users/${id}/follow`),
  unfollow: (id) => api.post(`/users/${id}/unfollow`),
  search: (q) => api.get(`/users/search?q=${q}`),
};

// Posts
export const postAPI = {
  create: (data) => api.post('/posts', data),
  getFeed: (params) => api.get('/posts/feed', { params }),
  getUserPosts: (userId, page = 1) => api.get(`/posts/user/${userId}?page=${page}`),
  getById: (id) => api.get(`/posts/${id}`),
  toggleLike: (id) => api.post(`/posts/${id}/like`),
  addComment: (id, text) => api.post(`/posts/${id}/comment`, { text }),
  remove: (id) => api.delete(`/posts/${id}`),
};

// Workouts
export const workoutAPI = {
  create: (data) => api.post('/workouts', data),
  getAll: (params) => api.get('/workouts', { params }),
  getById: (id) => api.get(`/workouts/${id}`),
  update: (id, data) => api.put(`/workouts/${id}`, data),
  remove: (id) => api.delete(`/workouts/${id}`),
  getStats: () => api.get('/workouts/stats'),
  getWeekly: () => api.get('/workouts/weekly'),
};

// Communities
export const communityAPI = {
  create: (data) => api.post('/communities', data),
  getAll: (params) => api.get('/communities', { params }),
  getById: (id) => api.get(`/communities/${id}`),
  join: (id) => api.post(`/communities/${id}/join`),
  leave: (id) => api.post(`/communities/${id}/leave`),
  search: (q) => api.get(`/communities/search?q=${q}`),
  update: (id, data) => api.put(`/communities/${id}`, data),
};

export default api;
