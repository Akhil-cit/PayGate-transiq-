import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import CustomerSidebar from './components/CustomerSidebar';
import ModeSwitcher from './components/ModeSwitcher';

// Module 1 — Customer Dashboard & Pockets
import CustomerDashboard from './modules/01-customer/pages/CustomerDashboard';

// Module 2 — Recipients / Participants
import RecipientList from './modules/02-recipients/pages/RecipientList';

// Module 3 — Send Money & My Wallet
import PaymentFlowContainer from './modules/03-initiation/pages/PaymentFlowContainer';
import MyWalletPage from './modules/03-initiation/pages/MyWalletPage';

// Module 4 — Transactions & Financial Analytics
import TransactionsPage from './modules/04-transactions/pages/TransactionsPage';
import FinancialAnalysisPage from './modules/04-transactions/pages/FinancialAnalysisPage';
import InsightsPage from './modules/04-transactions/pages/InsightsPage';

// Module 5 — Security
import SecurityPage from './modules/05-security/pages/SecurityPage';

// Module 6 — Admin Logs & Monitoring
import AdminMonitoring from './modules/06-logs/pages/AdminMonitoring';
import TransactionHistory from './modules/06-logs/pages/TransactionHistory';
import TransactionLogsPage from './modules/06-logs/pages/TransactionLogsPage';
import PendingTransactionsPage from './modules/06-logs/pages/PendingTransactionsPage';
import ErrorLogsPage from './modules/06-logs/pages/ErrorLogsPage';
import SettingsPage from './modules/06-logs/pages/SettingsPage';

import './App.css';
import './modules/01-customer/customer.css';
import './modules/02-recipients/styles/participant.css';
import './modules/04-transactions/transactions.css';

// Auth Pages (from Transiq-Module1)
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/admin/login';

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
      </Routes>
    );
  }

  // Auth protection for protected routes
  const token = localStorage.getItem('paygate_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const userJson = localStorage.getItem('paygate_user');
  const user = userJson ? JSON.parse(userJson) : null;
  const userRole = user?.role || 'customer';

  // Role-based route guard
  if (isAdmin && userRole !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="app">
      <ModeSwitcher />


      {isAdmin ? <AdminSidebar /> : <CustomerSidebar />}

      <main className="main-content">
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<CustomerDashboard />} />
          <Route path="/my-wallet" element={<MyWalletPage />} />
          <Route path="/my-pockets" element={<CustomerDashboard />} />
          <Route path="/recipients" element={<RecipientList />} />
          <Route path="/send-money" element={<PaymentFlowContainer />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/financial-analysis" element={<FinancialAnalysisPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/security" element={<SecurityPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Routes */}
          <Route path="/admin/monitoring" element={<AdminMonitoring />} />
          <Route path="/admin/history" element={<TransactionHistory />} />
          <Route path="/admin/logs" element={<TransactionLogsPage />} />
          <Route path="/admin/pending" element={<PendingTransactionsPage />} />
          <Route path="/admin/errors" element={<ErrorLogsPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
