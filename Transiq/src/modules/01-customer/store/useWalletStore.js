import { create } from 'zustand';
import walletService from '../../../api/walletService';

export const useWalletStore = create((set) => ({
  wallet: null, loading: false, error: null,
  fetchWallet: async () => {
    set({ loading: true, error: null });
    try { const { data } = await walletService.getMine(); set({ wallet: data.data, loading: false }); return data.data; }
    catch (err) { const message = err.response?.data?.message || 'Failed to fetch wallet'; set({ error: message, loading: false }); throw err; }
  },
  updateCurrency: async (currency) => {
    set({ loading: true, error: null });
    try { const { data } = await walletService.updateCurrency(currency); set({ wallet: data.data, loading: false }); return data.data; }
    catch (err) { const message = err.response?.data?.message || 'Failed to update currency'; set({ error: message, loading: false }); throw err; }
  },
  clearError: () => set({ error: null })
}));
