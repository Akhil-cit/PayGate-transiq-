import { create } from 'zustand';
import analyticsService from '../../../api/analyticsService';

export const useAnalyticsStore = create((set) => ({
  summary:  null,
  byMethod: [],
  byMonth:  [],
  insights: null,
  loading:  false,
  error:    null,

  // ── Summary ────────────────────────────────────────────────────────────────
  fetchSummary: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await analyticsService.getSummary();
      set({ summary: data.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load summary', loading: false });
    }
  },

  // ── By Method ──────────────────────────────────────────────────────────────
  fetchByMethod: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await analyticsService.getByMethod();
      set({ byMethod: data.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed', loading: false });
    }
  },

  // ── By Month ───────────────────────────────────────────────────────────────
  fetchByMonth: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await analyticsService.getByMonth();
      set({ byMonth: data.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed', loading: false });
    }
  },

  // ── Insights ───────────────────────────────────────────────────────────────
  fetchInsights: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await analyticsService.getInsights();
      set({ insights: data.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed', loading: false });
    }
  },

  // ── Fetch all at once ──────────────────────────────────────────────────────
  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const [s, m, mo, i] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getByMethod(),
        analyticsService.getByMonth(),
        analyticsService.getInsights(),
      ]);
      set({
        summary:  s.data.data,
        byMethod: m.data.data,
        byMonth:  mo.data.data,
        insights: i.data.data,
        loading:  false,
      });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load analytics', loading: false });
    }
  },

  // ── Export CSV ─────────────────────────────────────────────────────────────
  exportCsv: async () => {
    try {
      const response = await analyticsService.exportCsv();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('CSV export failed:', err);
    }
  },

  clearError: () => set({ error: null }),
}));
