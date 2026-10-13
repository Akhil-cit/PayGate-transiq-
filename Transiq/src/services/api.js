import authService from '../api/authService';
import customerService from '../api/customerService';
import axiosApi from '../api/axiosInstance';

export function getToken() { return localStorage.getItem('paygate_token'); }
export function getStoredUser() { try { return JSON.parse(localStorage.getItem('paygate_user') || 'null'); } catch { return null; } }
export function saveSession(token, user) { localStorage.setItem('paygate_token', token); localStorage.setItem('paygate_user', JSON.stringify(user)); }
export function clearSession() { localStorage.removeItem('paygate_token'); localStorage.removeItem('paygate_user'); }

export const apiCompat = axiosApi;
export const api = {
  register: async (payload) => {
    const res = await authService.register(payload);
    return res.data;
  },
  login: async (payload) => {
    const res = await authService.login(payload);
    return res.data;
  },
  adminLogin: async (payload) => {
    const res = await authService.adminLogin(payload);
    return res.data;
  },
  getMe: async () => {
    const res = await customerService.getMe();
    return res.data;
  },
  updateMe: async (payload) => {
    if (payload.name) {
      const parts = payload.name.trim().split(/\s+/);
      const res = await customerService.updateMe({ firstName: parts.shift(), lastName: parts.join(' ') || 'Customer' });
      return res.data;
    }
    const res = await customerService.updateMe(payload);
    return res.data;
  },
  getUsers: async (search = '') => {
    const res = await axiosApi.get('/admin/users', { params: { search } });
    return res.data;
  },
  updateUser: async (id, payload) => {
    const res = await axiosApi.patch(`/admin/users/${id}`, payload);
    return res.data;
  }
};
