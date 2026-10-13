import api from './axiosInstance';

export const securityService = {
  changePassword: async ({ oldPassword, newPassword }) => {
    const res = await api.put('/security/password', { oldPassword, newPassword });
    return res.data;
  },

  toggleFreeze: async () => {
    const res = await api.patch('/security/freeze');
    return res.data;
  },

  deactivateAccount: async () => {
    const res = await api.delete('/security/account');
    return res.data;
  },

  getActivityLog: async () => {
    const res = await api.get('/security/activity');
    return res.data;
  },

  terminateSession: async (sessionId) => {
    const res = await api.delete(`/security/sessions/${sessionId}`);
    return res.data;
  },

  terminateAllOtherSessions: async () => {
    const res = await api.delete('/security/sessions');
    return res.data;
  },

  updateSettings: async (settings) => {
    const res = await api.put('/security/settings', settings);
    return res.data;
  },
};

export default securityService;
