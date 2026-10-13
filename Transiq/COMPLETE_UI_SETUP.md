# PayGate - Complete UI Setup Guide

> **Current implementation notice:** The live, professional UI uses `src/components/CustomerSidebar.jsx`, `src/components/AdminSidebar.jsx`, `src/components/SidebarIcon.jsx`, `src/components/Sidebar.css`, `src/App.jsx`, and `src/App.css`. These files are authoritative. The older example blocks later in this document are retained as reference only; use the current source files instead of copying emoji-based examples.

## 🎯 Project Overview

PayGate is a payment gateway system that manages customer payments, transactions, and monitoring with a modular architecture supporting 6 core modules.

### Tech Stack
- **Frontend Framework**: React 19.2.8
- **Routing**: React Router DOM 7.18.3
- **UI Styling**: Tailwind CSS 4.3.3
- **State Management**: Zustand 5.0.15
- **Build Tool**: Vite 8.2.2
- **Package Manager**: npm

---

## 📋 Module Segregation (6 Modules)

| Module | Owner | Pages | Purpose |
|--------|-------|-------|---------|
| 1 | Team A | Landing Page, Customer Management | Entry point & customer info |
| 2 | Team B | Remitter & Recipient Management | Sender/receiver details |
| 3 | Team C | Payment Initiation | Payment form & validation |
| 4 | Team D | Transaction & Fund Processing | Core payment logic |
| 5 | Team E | Banking & Fund Handling | Fund transfer simulation |
| 6 | Team F (You) | Transaction Logs & Monitoring | Admin monitoring & logs |

---

## 🏗️ Project Structure

```
Transiq/
├── public/
├── src/
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # App styles
│   ├── index.css              # Global styles
│   ├── main.jsx               # Entry point
│   ├── assets/                # Images, icons
│   ├── components/
│   │   ├── Navigation.jsx      # Header navigation (reusable)
│   │   ├── Sidebar.jsx        # Sidebar component (CHOICE: Customer/Admin)
│   │   ├── Navigation.css     # Header styles
│   │   └── Sidebar.css        # Sidebar styles
│   └── modules/
│       ├── 01-landing/
│       ├── 02-remitter-recipient/
│       ├── 03-payment-initiation/
│       ├── 04-transaction-processing/
│       ├── 05-banking/
│       └── 06-logs/            # Your module
│           ├── components/
│           ├── pages/
│           └── store/
├── transiq-api/
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🎨 UI Components & Code

### 1. Sidebar Component (CUSTOMER VIEW)

**File**: `src/components/CustomerSidebar.jsx`

```jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const CustomerSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();

  const customerMenuItems = [
    { 
      to: '/', 
      label: 'Dashboard', 
      icon: '📊',
      color: 'text-blue-400'
    },
    { 
      to: '/my-wallet', 
      label: 'My wallet', 
      icon: '💳',
      color: 'text-slate-300'
    },
    { 
      to: '/my-pockets', 
      label: 'My pockets', 
      icon: '👜',
      color: 'text-slate-300'
    },
    { 
      to: '/recipients', 
      label: 'Recipients', 
      icon: '👥',
      color: 'text-green-400',
      badge: 'module 2'
    },
    { 
      to: '/send-money', 
      label: 'Send money (module 3, opens wizard)', 
      icon: '📤',
      color: 'text-blue-300',
      description: 'Payment wizard'
    },
    { 
      to: '/transactions', 
      label: 'Transactions', 
      icon: '💸',
      color: 'text-slate-300'
    },
    { 
      to: '/financial-analysis', 
      label: 'Financial analysis', 
      icon: '📈',
      color: 'text-slate-300'
    },
    { 
      to: '/insights', 
      label: 'Insights', 
      icon: '💡',
      color: 'text-slate-300'
    },
    { 
      to: '/security', 
      label: 'Security', 
      icon: '🔒',
      color: 'text-slate-300'
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`sidebar customer-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        <span className="sidebar-title">Customer menu</span>
        <button 
          className="sidebar-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle sidebar"
        >
          {isExpanded ? '◀' : '▶'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {customerMenuItems.map((item) => (
          <div key={item.to}>
            <Link
              to={item.to}
              className={`sidebar-item ${isActive(item.to) ? 'active' : ''}`}
            >
              <span className={`sidebar-icon ${item.color}`}>
                {item.icon}
              </span>
              {isExpanded && (
                <>
                  <span className="sidebar-label">{item.label}</span>
                  {item.badge && (
                    <span className="sidebar-badge">{item.badge}</span>
                  )}
                </>
              )}
            </Link>
            {item.description && isExpanded && (
              <p className="sidebar-description">{item.description}</p>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p className="text-xs text-slate-400">v1.0.0</p>
      </div>
    </aside>
  );
};

export default CustomerSidebar;
```

---

### 2. Sidebar Component (ADMIN VIEW)

**File**: `src/components/AdminSidebar.jsx`

```jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLogsStore } from '../modules/06-logs/store/logsStore';
import './Sidebar.css';

const AdminSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();
  
  const pendingCount = useLogsStore((state) => state.pendingTransactions.length);
  const unresolvedErrorCount = useLogsStore((state) => 
    state.errorLogs.filter((l) => !l.resolved).length
  );

  const adminMenuItems = [
    { 
      to: '/admin/monitoring', 
      label: 'Dashboard', 
      icon: '📊',
      color: 'text-blue-400',
      description: 'System overview'
    },
    { 
      to: '/admin/wallet', 
      label: 'Wallet Manager', 
      icon: '💰',
      color: 'text-green-400',
      description: 'Fund management'
    },
    { 
      to: '/admin/users', 
      label: 'User Management', 
      icon: '👥',
      color: 'text-purple-400',
      description: 'Customer accounts'
    },
    { 
      to: '/admin/transactions', 
      label: 'Transactions', 
      icon: '💸',
      color: 'text-yellow-400',
      description: 'All payments'
    },
    { 
      to: '/admin/history', 
      label: 'Payment History', 
      icon: '📋',
      color: 'text-slate-300'
    },
    { 
      to: '/admin/logs', 
      label: 'Transaction Logs', 
      icon: '📝',
      color: 'text-slate-300'
    },
    { 
      to: '/admin/pending', 
      label: 'Pending Monitor', 
      icon: '⏳',
      color: 'text-amber-400',
      badge: pendingCount > 0 ? pendingCount : null,
      badgeColor: 'bg-amber-400 text-slate-900'
    },
    { 
      to: '/admin/errors', 
      label: 'Error Logs', 
      icon: '⚠️',
      color: 'text-red-400',
      badge: unresolvedErrorCount > 0 ? unresolvedErrorCount : null,
      badgeColor: 'bg-red-500 text-white'
    },
    { 
      to: '/admin/bank-sync', 
      label: 'Bank Sync', 
      icon: '🏦',
      color: 'text-cyan-400',
      description: 'Banking integration'
    },
    { 
      to: '/admin/analytics', 
      label: 'Analytics', 
      icon: '📊',
      color: 'text-slate-300'
    },
    { 
      to: '/admin/security', 
      label: 'Security', 
      icon: '🔒',
      color: 'text-red-400',
      description: 'Security settings'
    },
    { 
      to: '/admin/settings', 
      label: 'Settings', 
      icon: '⚙️',
      color: 'text-slate-400'
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`sidebar admin-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        <span className="sidebar-title">Admin Panel</span>
        <button 
          className="sidebar-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle sidebar"
        >
          {isExpanded ? '◀' : '▶'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {adminMenuItems.map((item) => (
          <div key={item.to} className="sidebar-item-wrapper">
            <Link
              to={item.to}
              className={`sidebar-item ${isActive(item.to) ? 'active' : ''}`}
            >
              <span className={`sidebar-icon ${item.color}`}>
                {item.icon}
              </span>
              {isExpanded && (
                <>
                  <span className="sidebar-label">{item.label}</span>
                  {item.badge && (
                    <span className={`sidebar-badge ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
            {item.description && isExpanded && (
              <p className="sidebar-description">{item.description}</p>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="admin-info">
          <div className="admin-avatar">👨‍💼</div>
          {isExpanded && (
            <div className="admin-details">
              <p className="admin-name">Admin</p>
              <p className="admin-role">Module 6 - Logs</p>
            </div>
          )}
        </div>
        <p className="text-xs text-slate-400">v1.0.0</p>
      </div>
    </aside>
  );
};

export default AdminSidebar;
```

---

### 3. Sidebar Styling

**File**: `src/components/Sidebar.css`

```css
/* ============ SIDEBAR BASE STYLES ============ */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  background: linear-gradient(135deg, #1a1f2e 0%, #16213e 100%);
  border-right: 1px solid rgba(148, 163, 184, 0.2);
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Expanded state */
.sidebar.expanded {
  width: 280px;
  padding: 1.5rem 0;
}

/* Collapsed state */
.sidebar.collapsed {
  width: 80px;
  padding: 1.5rem 0;
}

/* ============ SIDEBAR HEADER ============ */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  margin-bottom: 2rem;
  height: 40px;
}

.sidebar-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #60a5fa;
  letter-spacing: 0.5px;
  text-transform: capitalize;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sidebar.expanded .sidebar-title {
  opacity: 1;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.sidebar-toggle:hover {
  background: rgba(148, 163, 184, 0.1);
  color: #cbd5e1;
}

/* ============ SIDEBAR NAVIGATION ============ */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

.sidebar-item-wrapper {
  margin-bottom: 0.5rem;
  padding: 0 0.75rem;
}

/* ============ SIDEBAR ITEMS ============ */
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  color: #cbd5e1;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.sidebar-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: #3b82f6;
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.2s ease;
}

.sidebar-item:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #f0f4f8;
}

.sidebar-item.active {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  font-weight: 500;
}

.sidebar-item.active::before {
  transform: scaleY(1);
}

.sidebar.collapsed .sidebar-item {
  justify-content: center;
  padding: 0.875rem 0.5rem;
  gap: 0;
}

/* ============ SIDEBAR ICON & LABEL ============ */
.sidebar-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.sidebar-label {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.3px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sidebar.expanded .sidebar-label {
  opacity: 1;
}

.sidebar-description {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
  margin-left: 2.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  max-width: 200px;
  line-height: 1.3;
}

.sidebar.expanded .sidebar-description {
  opacity: 1;
}

/* ============ SIDEBAR BADGE ============ */
.sidebar-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sidebar.expanded .sidebar-badge {
  opacity: 1;
}

/* ============ SIDEBAR FOOTER ============ */
.sidebar-footer {
  border-top: 1px solid rgba(148, 163, 184, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.sidebar.expanded .sidebar-footer {
  align-items: flex-start;
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.375rem;
  background: rgba(59, 130, 246, 0.05);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sidebar.expanded .admin-info {
  opacity: 1;
}

.sidebar.collapsed .admin-info {
  padding: 0.5rem 0;
  background: transparent;
  justify-content: center;
  opacity: 1;
}

.admin-avatar {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.admin-details {
  flex: 1;
  min-width: 0;
}

.admin-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #e2e8f0;
  margin: 0;
}

.admin-role {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ============ RESPONSIVE DESIGN ============ */
@media (max-width: 768px) {
  .sidebar.expanded {
    width: 240px;
  }

  .sidebar.collapsed {
    width: 70px;
  }

  .sidebar-description {
    display: none;
  }
}

@media (max-width: 640px) {
  .sidebar {
    position: fixed;
    left: -100%;
    top: 60px;
    height: calc(100vh - 60px);
    width: 240px;
    border-right: 1px solid rgba(148, 163, 184, 0.2);
    transition: left 0.3s ease;
  }

  .sidebar.expanded {
    left: 0;
    width: 240px;
  }

  .sidebar.collapsed {
    left: -100%;
  }
}

/* ============ CUSTOMER SIDEBAR SPECIFIC ============ */
.customer-sidebar {
  background: linear-gradient(135deg, #1a1f2e 0%, #16213e 100%);
}

.customer-sidebar .sidebar-icon {
  font-size: 1rem;
}

/* ============ ADMIN SIDEBAR SPECIFIC ============ */
.admin-sidebar {
  background: linear-gradient(135deg, #0f172a 0%, #1a1f2e 100%);
}

.admin-sidebar .sidebar-title {
  color: #f0fdf4;
}

.admin-sidebar .sidebar-item.active {
  background: rgba(34, 197, 94, 0.15);
  color: #86efac;
}

.admin-sidebar .sidebar-item.active::before {
  background: #22c55e;
}

/* ============ SCROLLBAR ============ */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.2);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.4);
}

/* ============ ANIMATIONS ============ */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.sidebar-item {
  animation: slideIn 0.2s ease-out;
}
```

---

### 4. Updated App Component

**File**: `src/App.jsx`

```jsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CustomerSidebar from './components/CustomerSidebar';
import AdminSidebar from './components/AdminSidebar';
import Navigation from './components/Navigation';

// Module 6 Pages (Admin/Logs)
import AdminMonitoring from './modules/06-logs/pages/AdminMonitoring';
import TransactionHistory from './modules/06-logs/pages/TransactionHistory';
import TransactionLogsPage from './modules/06-logs/pages/TransactionLogsPage';
import PendingTransactionsPage from './modules/06-logs/pages/PendingTransactionsPage';
import ErrorLogsPage from './modules/06-logs/pages/ErrorLogsPage';

import './App.css';

function App() {
  // ✅ CHANGE THIS to switch between 'customer' and 'admin' mode
  const [userMode] = useState('admin'); // Set to 'customer' for customer view

  return (
    <BrowserRouter>
      <div className="app">
        {/* Navigation Bar - Always visible */}
        <Navigation />

        {/* Sidebar - Changes based on userMode */}
        {userMode === 'admin' ? <AdminSidebar /> : <CustomerSidebar />}

        {/* Main Content Area */}
        <main className={`main-content ${userMode === 'admin' ? 'admin-layout' : 'customer-layout'}`}>
          <Routes>
            {/* Admin Routes (Module 6) */}
            {userMode === 'admin' && (
              <>
                <Route path="/admin/monitoring" element={<AdminMonitoring />} />
                <Route path="/admin/history" element={<TransactionHistory />} />
                <Route path="/admin/logs" element={<TransactionLogsPage />} />
                <Route path="/admin/pending" element={<PendingTransactionsPage />} />
                <Route path="/admin/errors" element={<ErrorLogsPage />} />
                <Route path="/" element={<Navigate to="/admin/monitoring" replace />} />
                <Route path="*" element={<Navigate to="/admin/monitoring" replace />} />
              </>
            )}

            {/* Customer Routes (Placeholder for modules 1-5) */}
            {userMode === 'customer' && (
              <>
                <Route path="/" element={<div className="placeholder-page">Dashboard - Module 1</div>} />
                <Route path="/my-wallet" element={<div className="placeholder-page">Wallet - Module 1</div>} />
                <Route path="/my-pockets" element={<div className="placeholder-page">Pockets - Module 1</div>} />
                <Route path="/recipients" element={<div className="placeholder-page">Recipients - Module 2</div>} />
                <Route path="/send-money" element={<div className="placeholder-page">Send Money Wizard - Module 3</div>} />
                <Route path="/transactions" element={<div className="placeholder-page">Transactions - Module 4</div>} />
                <Route path="/financial-analysis" element={<div className="placeholder-page">Financial Analysis - Module 4</div>} />
                <Route path="/insights" element={<div className="placeholder-page">Insights - Module 4</div>} />
                <Route path="/security" element={<div className="placeholder-page">Security - Module 5</div>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
```

---

### 5. Updated App.css

**File**: `src/App.css`

```css
/* ============ ROOT STYLES ============ */
:root {
  --color-primary: #3b82f6;
  --color-primary-dark: #1e40af;
  --color-accent: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-bg: #0f172a;
  --color-bg-secondary: #1a1f2e;
  --color-text: #e2e8f0;
  --color-text-secondary: #94a3b8;
  --color-border: #334155;
  --sidebar-width: 280px;
  --sidebar-width-collapsed: 80px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ============ APP CONTAINER ============ */
.app {
  display: flex;
  height: 100vh;
  background: var(--color-bg);
  color: var(--color-text);
}

/* ============ MAIN CONTENT ============ */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: var(--sidebar-width);
  margin-top: 60px;
  background: linear-gradient(135deg, #0f172a 0%, #1a1f2e 50%, #0f172a 100%);
  overflow-y: auto;
  transition: margin-left 0.3s ease;
}

.main-content.admin-layout {
  margin-left: var(--sidebar-width);
}

.main-content.customer-layout {
  margin-left: var(--sidebar-width);
}

/* Scrollbar styling */
.main-content::-webkit-scrollbar {
  width: 8px;
}

.main-content::-webkit-scrollbar-track {
  background: transparent;
}

.main-content::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 4px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

/* ============ PLACEHOLDER PAGE ============ */
.placeholder-page {
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  font-size: 1.5rem;
  color: var(--color-text-secondary);
  text-align: center;
  border: 2px dashed var(--color-border);
  border-radius: 0.5rem;
  margin: 2rem;
}

/* ============ RESPONSIVE DESIGN ============ */
@media (max-width: 768px) {
  .main-content {
    margin-left: var(--sidebar-width-collapsed);
  }

  .main-content.admin-layout,
  .main-content.customer-layout {
    margin-left: var(--sidebar-width-collapsed);
  }
}

@media (max-width: 640px) {
  .main-content {
    margin-left: 0;
    margin-top: 60px;
  }

  .app {
    flex-direction: column;
  }
}

/* ============ TAILWIND DIRECTIVES ============ */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 📖 Implementation Guide for Team Members

### For Your Team (Module 6 - Admin/Logs)

**You are DONE!** ✅ Your module is already integrated.

**What you have:**
- Admin sidebar with all your pages
- Badge counters for pending & error logs
- Complete monitoring dashboard
- All navigation routes configured

**Files:**
- Component pages in `src/modules/06-logs/pages/`
- Store in `src/modules/06-logs/store/logsStore.js`

---

### For Other Modules (1-5)

#### Step 1: Create Your Module Folder

```bash
mkdir -p src/modules/0X-your-module/pages
mkdir -p src/modules/0X-your-module/components
mkdir -p src/modules/0X-your-module/store
```

#### Step 2: Create Module Pages

Example for Module 1:

**File**: `src/modules/01-landing/pages/Dashboard.jsx`

```jsx
import React from 'react';

const Dashboard = () => {
  return (
    <div className="module-page">
      <h1>Module 1 - Dashboard</h1>
      <p>Your content here...</p>
    </div>
  );
};

export default Dashboard;
```

#### Step 3: Add Routes to App.jsx

In the customer sidebar routes section:

```jsx
{userMode === 'customer' && (
  <>
    <Route path="/" element={<Dashboard />} />
    {/* Your other routes */}
  </>
)}
```

#### Step 4: Add Menu Items to CustomerSidebar.jsx

```jsx
const customerMenuItems = [
  // ... existing items
  {
    to: '/your-route',
    label: 'Your Feature',
    icon: '🎯',
    color: 'text-blue-400'
  }
];
```

---

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Visit: `http://localhost:5173`

### 3. Switch Between Customer/Admin View

Edit `src/App.jsx` line:
```jsx
const [userMode] = useState('admin'); // Change to 'customer'
```

### 4. Build for Production

```bash
npm run build
```

---

## 🎯 Key Features

✅ **Two Complete UI Modes**
- Customer View: Full feature menu (9 items)
- Admin View: Monitoring & management (12 items)

✅ **Responsive Design**
- Expandable/Collapsible sidebar
- Mobile-friendly layout
- Smooth animations

✅ **State Management**
- Zustand for global state
- Real-time badge counters
- Route persistence

✅ **Accessibility**
- Semantic HTML
- ARIA labels
- Keyboard navigation

✅ **Performance**
- Lazy routing
- Optimized re-renders
- CSS transitions

---

## 📦 Dependencies Used

```json
{
  "react": "^19.2.8",
  "react-dom": "^19.2.8",
  "react-router-dom": "^7.18.3",
  "zustand": "^5.0.15",
  "tailwindcss": "^4.3.3",
  "vite": "^8.2.2"
}
```

---

## 🎨 Design System

### Color Palette
- **Primary**: `#3b82f6` (Blue)
- **Accent**: `#22c55e` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Danger**: `#ef4444` (Red)
- **Background**: `#0f172a` (Dark Navy)
- **Text**: `#e2e8f0` (Light Gray)

### Spacing
- Base unit: 0.25rem (4px)
- Padding: 0.75rem to 2rem
- Gap: 0.5rem to 1.5rem

### Typography
- Font: System font stack
- Sizes: 0.75rem - 1.5rem
- Weights: 400 (regular), 500 (medium), 600 (semibold)

---

## 📋 Checklist for Team Members

When implementing your module:

- [ ] Create module folder structure
- [ ] Build your pages/components
- [ ] Set up Zustand store (if needed)
- [ ] Add routes to App.jsx
- [ ] Add menu items to appropriate sidebar
- [ ] Test all navigation links
- [ ] Test responsive design (mobile/tablet)
- [ ] Ensure consistent styling
- [ ] Document your API endpoints
- [ ] Submit for code review

---

## 🔗 Navigation Flow

```
┌─ Customer View
│  ├─ Dashboard (Module 1)
│  ├─ My wallet (Module 1)
│  ├─ My pockets (Module 1)
│  ├─ Recipients (Module 2)
│  ├─ Send money (Module 3)
│  ├─ Transactions (Module 4)
│  ├─ Financial analysis (Module 4)
│  ├─ Insights (Module 4)
│  └─ Security (Module 5)
│
└─ Admin View (Module 6)
   ├─ Dashboard
   ├─ Payment History
   ├─ Transaction Logs
   ├─ Pending Monitor (badge)
   ├─ Error Logs (badge)
   └─ Settings
```

---

## 🚀 Next Steps

1. **Share this README** with all team members
2. **Test both views** (customer & admin)
3. **Each module** implements their pages in their folder
4. **Update App.jsx** with your routes
5. **Add menu items** to respective sidebar
6. **Test navigation** before merging

---

## 📞 Support

For questions about:
- **UI/Design**: Refer to Sidebar.css & App.css
- **Routing**: Check App.jsx routes
- **State**: See logsStore.js pattern
- **Components**: Review sidebar components

---

## ✨ Features Coming Soon

- [ ] Dark/Light theme toggle
- [ ] User authentication
- [ ] Module permission system
- [ ] Advanced filtering
- [ ] Export functionality
- [ ] Real-time notifications
- [ ] Search across modules

---

**Last Updated**: 2025
**Version**: 1.0.0
**Status**: Ready for Module Integration ✅

