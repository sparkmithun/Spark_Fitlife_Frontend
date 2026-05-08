'use client';

import { create } from 'zustand';
import { authAPI } from '@/lib/api';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: true,

  initialize: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('spark_token');
      const user = localStorage.getItem('spark_user');
      set({
        token,
        user: user ? JSON.parse(user) : null,
        loading: false,
      });
    }
  },

  login: async (credentials) => {
    const { data } = await authAPI.login(credentials);
    localStorage.setItem('spark_token', data.token);
    localStorage.setItem('spark_user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
    return data;
  },

  register: async (userData) => {
    const { data } = await authAPI.register(userData);
    // OTP sent — don't auto-login, return response for OTP step
    return data;
  },

  verifyOtp: async ({ email, otp }) => {
    const { data } = await authAPI.verifyOtp({ email, otp });
    localStorage.setItem('spark_token', data.token);
    localStorage.setItem('spark_user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
    return data;
  },

  resendOtp: async (email) => {
    const { data } = await authAPI.resendOtp({ email });
    return data;
  },

  logout: () => {
    localStorage.removeItem('spark_token');
    localStorage.removeItem('spark_user');
    set({ user: null, token: null });
  },

  updateUser: (userData) => {
    localStorage.setItem('spark_user', JSON.stringify(userData));
    set({ user: userData });
  },
}));

export default useAuthStore;
