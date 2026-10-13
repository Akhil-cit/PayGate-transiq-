import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const originalFetch = window.fetch;
window.fetch = async (resource, config = {}) => {
  const token = localStorage.getItem('paygate_token');
  if (token && typeof resource === 'string' && resource.includes('/api/')) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    };
  }
  
  const response = await originalFetch(resource, config);
  
  if (response.status === 401) {
    localStorage.removeItem('paygate_token');
    localStorage.removeItem('paygate_user');
    if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
      window.location.href = window.location.pathname.startsWith('/admin') ? '/admin/login' : '/login';
    }
  }
  
  return response;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
