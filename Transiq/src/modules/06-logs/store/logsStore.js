import { create } from 'zustand';
import adminService from '../../../api/adminService';

export const useLogsStore = create((set, get) => ({
  stats: null,
  transactionLogs: [],
  errorLogs: [],
  pendingTransactions: [],
  selectedTransaction: null,
  loading: false,
  statsLoading: false,
  errorsLoading: false,
  error: null,
  systemHealth: null,
  healthLoading: false,
  pagination: { currentPage: 1, totalPages: 1, totalRecords: 0, limit: 20 },
  errorsPagination: { currentPage: 1, totalPages: 1, totalRecords: 0, limit: 20 },

  fetchHealth: async () => {
    set({ healthLoading: true });
    try {
      const { data } = await adminService.getHealth();
      set({ systemHealth: data.data, healthLoading: false });
    } catch (err) {
      set({
        systemHealth: {
          status: 'Degraded',
          database: 'Unreachable',
          dbPingMs: 'N/A',
          serverLatency: 'N/A',
          memoryHeapUsed: 'N/A',
          uptime: 'N/A',
        },
        healthLoading: false,
      });
    }
  },

  fetchStats: async () => {
    set({ statsLoading: true, error: null });
    try {
      const { data } = await adminService.getStats();
      set({ stats: data.data, statsLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load stats', statsLoading: false });
    }
  },

  fetchTransactions: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { data } = await adminService.getTransactions(params);
      const all = data.data || [];
      set({
        transactionLogs: all.filter((t) => t.status !== 'pending'),
        pendingTransactions: all.filter((t) => t.status === 'pending'),
        pagination: data.pagination || get().pagination,
        loading: false,
      });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load transactions', loading: false });
    }
  },

  fetchTransactionById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await adminService.getTransactionById(id);
      set({ selectedTransaction: data.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load transaction', loading: false });
    }
  },

  resolvePendingTransaction: async (id) => {
    try {
      await adminService.forceSuccess(id);
      set((state) => ({
        pendingTransactions: state.pendingTransactions.filter((t) => t._id !== id),
        transactionLogs: state.transactionLogs.map((t) =>
          t._id === id ? { ...t, status: 'success' } : t
        ),
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to settle transaction' });
    }
  },

  cancelPendingTransaction: async (id) => {
    try {
      await adminService.forceFail(id, 'BANK_TIMEOUT');
      set((state) => ({
        pendingTransactions: state.pendingTransactions.filter((t) => t._id !== id),
        transactionLogs: state.transactionLogs.map((t) =>
          t._id === id ? { ...t, status: 'failure' } : t
        ),
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to cancel transaction' });
    }
  },

  fetchErrors: async (params = {}) => {
    set({ errorsLoading: true, error: null });
    try {
      const { data } = await adminService.getErrors(params);
      set({
        errorLogs: data.data || [],
        errorsPagination: data.pagination || get().errorsPagination,
        errorsLoading: false,
      });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load error logs', errorsLoading: false });
    }
  },

  toggleResolveError: async (errorId, notes = '') => {
    try {
      const { data } = await adminService.resolveError(errorId, notes);
      set((state) => ({
        errorLogs: state.errorLogs.map((e) =>
          e._id === errorId ? data.data : e
        ),
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to resolve error' });
    }
  },

  resolveAllErrors: async () => {
    try {
      await adminService.resolveAllErrors();
      set((state) => ({
        errorLogs: state.errorLogs.map((e) => ({
          ...e,
          resolved: true,
          resolvedAt: new Date().toISOString(),
        })),
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to resolve all errors' });
    }
  },

  retryFailedTransaction: async (id) => {
    await get().fetchTransactionById(id);
  },

  clearError: () => set({ error: null }),
}));
