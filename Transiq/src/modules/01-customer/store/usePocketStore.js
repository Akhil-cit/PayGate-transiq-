import { create } from 'zustand';
import pocketService from '../../../api/pocketService';

export const usePocketStore = create((set) => ({
  items: [], selectedItem: null, loading: false, error: null,
  fetchAll: async () => {
    set({ loading: true, error: null });
    try { const { data } = await pocketService.getAll(); set({ items: data.data || [], loading: false }); }
    catch (err) { set({ error: err.response?.data?.message || 'Failed to fetch pockets', loading: false }); }
  },
  create: async (payload) => {
    set({ loading: true, error: null });
    try { const { data } = await pocketService.create(payload); set((s) => ({ items: [data.data, ...s.items], loading: false })); return { success: true, data: data.data }; }
    catch (err) { set({ error: err.response?.data?.message || 'Failed to create pocket', loading: false }); return { success: false }; }
  },
  update: async (id, payload) => {
    set({ loading: true, error: null });
    try { const { data } = await pocketService.update(id, payload); set((s) => ({ items: s.items.map((i) => i._id === id ? data.data : i), loading: false })); return { success: true, data: data.data }; }
    catch (err) { set({ error: err.response?.data?.message || 'Failed to update pocket', loading: false }); return { success: false }; }
  },
  deposit: async (id, amount) => {
    set({ loading: true, error: null });
    try { const { data } = await pocketService.deposit(id, amount); set((s) => ({ items: s.items.map((i) => i._id === id ? data.data.pocket : i), loading: false })); return { success: true, data: data.data }; }
    catch (err) { set({ error: err.response?.data?.message || 'Failed to deposit', loading: false }); return { success: false }; }
  },
  withdraw: async (id, amount) => {
    set({ loading: true, error: null });
    try { const { data } = await pocketService.withdraw(id, amount); set((s) => ({ items: s.items.map((i) => i._id === id ? data.data.pocket : i), loading: false })); return { success: true, data: data.data }; }
    catch (err) { set({ error: err.response?.data?.message || 'Failed to withdraw', loading: false }); return { success: false }; }
  },
  toggleLock: async (id) => {
    set({ loading: true, error: null });
    try { const { data } = await pocketService.toggleLock(id); set((s) => ({ items: s.items.map((i) => i._id === id ? data.data : i), loading: false })); return { success: true, data: data.data }; }
    catch (err) { set({ error: err.response?.data?.message || 'Failed to change pocket lock', loading: false }); return { success: false }; }
  },
  remove: async (id) => {
    set({ loading: true, error: null });
    try { const { data } = await pocketService.remove(id); set((s) => ({ items: s.items.filter((i) => i._id !== id), loading: false })); return { success: true, data: data.data }; }
    catch (err) { set({ error: err.response?.data?.message || 'Failed to delete pocket', loading: false }); return { success: false }; }
  },
  clearError: () => set({ error: null })
}));
