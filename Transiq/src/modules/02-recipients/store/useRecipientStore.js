import { create } from 'zustand';
import recipientService from '../../../api/recipientService';

const extractErrorMessage = (err, fallback) => {
  if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
    return err.response.data.errors.map((e) => e.message).join('. ');
  }
  return err.response?.data?.message || err.message || fallback;
};

export const useRecipientStore = create((set, get) => ({
  // ── State ─────────────────────────────────────────────
  recipients: [],
  selectedRecipient: null,
  loading: false,
  error: null,
  successMessage: null,

  // ── Fetch all recipients ──────────────────────────────
  fetchAll: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { data } = await recipientService.getAll(params);
      set({ recipients: data.data || [], loading: false });
    } catch (err) {
      set({
        error: extractErrorMessage(err, 'Failed to fetch recipients'),
        loading: false,
      });
    }
  },

  // ── Get single recipient ──────────────────────────────
  fetchById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await recipientService.getById(id);
      set({ selectedRecipient: data.data, loading: false });
      return { success: true, data: data.data };
    } catch (err) {
      set({
        error: extractErrorMessage(err, 'Failed to fetch recipient'),
        loading: false,
      });
      return { success: false };
    }
  },

  // ── Create recipient ─────────────────────────────────
  create: async (payload) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const { data } = await recipientService.create(payload);
      set((state) => ({
        recipients: [data.data, ...state.recipients],
        selectedRecipient: data.data,
        loading: false,
        successMessage: data.message || 'Recipient added successfully',
      }));
      return { success: true, data: data.data };
    } catch (err) {
      const message = extractErrorMessage(err, 'Failed to add recipient');
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // ── Update recipient ─────────────────────────────────
  update: async (id, payload) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const { data } = await recipientService.update(id, payload);
      set((state) => ({
        recipients: state.recipients.map((r) => (r._id === id ? data.data : r)),
        selectedRecipient:
          state.selectedRecipient?._id === id ? data.data : state.selectedRecipient,
        loading: false,
        successMessage: data.message || 'Recipient updated successfully',
      }));
      return { success: true, data: data.data };
    } catch (err) {
      const message = extractErrorMessage(err, 'Failed to update recipient');
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // ── Delete recipient ──────────────────────────────────
  remove: async (id) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      await recipientService.remove(id);
      set((state) => {
        const remaining = state.recipients.filter((r) => r._id !== id);
        return {
          recipients: remaining,
          selectedRecipient:
            state.selectedRecipient?._id === id ? (remaining[0] || null) : state.selectedRecipient,
          loading: false,
          successMessage: 'Recipient removed successfully',
        };
      });
      return { success: true };
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to delete recipient',
        loading: false,
      });
      return { success: false };
    }
  },

  // ── Toggle favourite ──────────────────────────────────
  toggleFavourite: async (id) => {
    set({ error: null });
    try {
      const { data } = await recipientService.toggleFavourite(id);
      set((state) => ({
        recipients: state.recipients.map((r) => (r._id === id ? data.data : r)),
        selectedRecipient:
          state.selectedRecipient?._id === id ? data.data : state.selectedRecipient,
        successMessage: data.message,
      }));
      return { success: true };
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to toggle favourite' });
      return { success: false };
    }
  },

  // ── Select a recipient ────────────────────────────────
  setSelected: (recipient) => set({ selectedRecipient: recipient }),

  // ── Clear messages ────────────────────────────────────
  clearError: () => set({ error: null }),
  clearSuccess: () => set({ successMessage: null }),
}));
