import { create } from 'zustand';
import customerService from '../../../api/customerService';

export const useCustomerStore = create((set) => ({
  user: null, loading: false, error: null,
  fetchMe: async () => {
    set({ loading: true, error: null });
    try { const { data } = await customerService.getMe(); set({ user: data.data, loading: false }); return data.data; }
    catch (err) { const message = err.response?.data?.message || 'Failed to fetch customer'; set({ error: message, loading: false }); throw err; }
  },
  updateMe: async (payload) => {
    set({ loading: true, error: null });
    try { const { data } = await customerService.updateMe(payload); set({ user: data.data, loading: false }); localStorage.setItem('paygate_user', JSON.stringify(data.data)); return data.data; }
    catch (err) { const message = err.response?.data?.message || 'Failed to update profile'; set({ error: message, loading: false }); throw err; }
  },
  clearError: () => set({ error: null })
}));
