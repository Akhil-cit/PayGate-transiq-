import { create } from 'zustand';
import transactionService from '../../../api/transactionService';

export const useTransactionStore = create((set, get) => ({
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pages: 1,
  filters: {},

  // ── Fetch all with filters ─────────────────────────────────────────────────
  fetchAll: async (params = {}) => {
    set({ loading: true, error: null, filters: params });
    try {
      const { data } = await transactionService.getAll(params);
      set({
        items:   data.data,
        total:   data.total,
        page:    data.page,
        pages:   data.pages,
        loading: false,
      });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load transactions', loading: false });
    }
  },

  // ── Fetch single transaction ───────────────────────────────────────────────
  fetchById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await transactionService.getById(id);
      set({ selectedItem: data.data, loading: false });
      return data.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Not found', loading: false });
      return null;
    }
  },

  // ── Initiate transfer ──────────────────────────────────────────────────────
  create: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await transactionService.create(payload);
      set((state) => ({ items: [data.data, ...state.items], loading: false }));
      return { success: true, data: data.data };
    } catch (err) {
      set({ error: err.response?.data?.message || 'Transaction failed', loading: false });
      return { success: false, message: err.response?.data?.message };
    }
  },

  // ── Cancel pending ─────────────────────────────────────────────────────────
  cancel: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await transactionService.cancel(id);
      set((state) => ({
        items: state.items.map((t) => (t._id === id ? data.data : t)),
        loading: false,
      }));
      return { success: true };
    } catch (err) {
      set({ error: err.response?.data?.message || 'Cancel failed', loading: false });
      return { success: false };
    }
  },

  // ── Retry failed ───────────────────────────────────────────────────────────
  retry: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await transactionService.retry(id);
      set((state) => ({ items: [data.data, ...state.items], loading: false }));
      return { success: true, data: data.data };
    } catch (err) {
      set({ error: err.response?.data?.message || 'Retry failed', loading: false });
      return { success: false };
    }
  },

  // ── Pre-flight validate ────────────────────────────────────────────────────
  validate: async (payload) => {
    try {
      const { data } = await transactionService.validate(payload);
      return data;
    } catch (err) {
      return { success: false, canProceed: false };
    }
  },

  setPage: (page) => set({ page }),
  clearError: () => set({ error: null }),
  clearSelected: () => set({ selectedItem: null }),
}));
