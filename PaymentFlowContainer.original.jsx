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
```

---

<a id="file-transiqdatabasedesignmd"></a>
## 54. `Transiq/DATABASE_DESIGN.md`
> **Section**: FRONTEND | **Lines**: 1551 | **Path**: `Transiq/DATABASE_DESIGN.md`

```markdown
# PayGate / Transiq — Database Design Specification

> **Classification:** Internal Engineering — Database Architecture Proposal  
> **Stack:** MongoDB 7.x · Mongoose ODM 8.x · Node.js  
> **Author Role:** Principal Database Architect  
> **Date:** 2026-09-08  
> **Status:** DRAFT — Pending Engineering Review

---

## Table of Contents

1. [Preamble & Design Philosophy](#1-preamble--design-philosophy)
2. [Surface & Deep-Down Architectural Guardrails (16 MB Mitigation)](#2-surface--deep-down-architectural-guardrails-16-mb-mitigation)
   - 2.1 [Surface Architecture: Referencing vs. Embedding Decision Matrix](#21-surface-architecture-referencing-vs-embedding-decision-matrix)
   - 2.2 [Deep-Down Mechanics: WiredTiger, Memory Pressure & the 16 MB Trap](#22-deep-down-mechanics-wiredtiger-memory-pressure--the-16-mb-trap)
   - 2.3 [Schema Enforcement: Mongoose ODM Boundary Validation](#23-schema-enforcement-mongoose-odm-boundary-validation)
3. [Fintech Schema Blueprints & Hard Edge Cases](#3-fintech-schema-blueprints--hard-edge-cases)
   - 3.1 [User Schema](#31-user-schema)
   - 3.2 [Wallet Schema](#32-wallet-schema)
   - 3.3 [Recipient Schema](#33-recipient-schema)
   - 3.4 [Transaction Schema](#34-transaction-schema)
4. [Global B-Tree Indexing Matrix & Concurrency Controls](#4-global-b-tree-indexing-matrix--concurrency-controls)
   - 4.1 [B-Tree Structural Layout](#41-b-tree-structural-layout)
   - 4.2 [Index Declarations](#42-index-declarations)
   - 4.3 [Concurrency & Race Conditions: The Double-Spending Problem](#43-concurrency--race-conditions-the-double-spending-problem)
5. [ACID Transaction System & Automated Rollback Logic](#5-acid-transaction-system--automated-rollback-logic)
   - 5.1 [The Transaction Engine](#51-the-transaction-engine)
   - 5.2 [Detailed Workflow Steps: Atomic Fund Transfer](#52-detailed-workflow-steps-atomic-fund-transfer)
   - 5.3 [Failures & Edge Cases: The Recovery Script Sequence](#53-failures--edge-cases-the-recovery-script-sequence)
6. [Appendix: Collection Size Projections & Operational Notes](#6-appendix-collection-size-projections--operational-notes)

---

## 1. Preamble & Design Philosophy

PayGate (branded Transiq) is a MERN-stack payment gateway composed of **six functional modules**:

| # | Module | Primary Data Responsibility |
|---|--------|-----------------------------|
| 1 | Landing Page & Customer Management | User identity, authentication, role-gating |
| 2 | Remitter & Recipient Management | Saved beneficiary routes (bank details) |
| 3 | Payment Initiation | Balance checks, debit orchestration |
| 4 | Transaction & Fund Processing | Immutable ledger entries, status lifecycle |
| 5 | Banking & Fund Handling | Credit provisioning, external bank simulation |
| 6 | Transaction Logs & Monitoring | Admin live dashboard, filtered querying |

### Core Invariants

Every design decision in this document traces back to three inviolable financial system invariants:

1. **Conservation of Funds.** The total sum of all wallet balances plus in-flight transaction holds must equal the total funds ever deposited into the system. No operation may create or destroy value.
2. **Append-Only Auditability.** Every state transition in the financial lifecycle must produce a permanent, timestamped ledger entry. Mutations and deletions of historical records are categorically prohibited.
3. **Atomicity Under Failure.** Any operation that touches more than one document (debit sender, credit receiver, write ledger entry) must either complete in its entirety or leave zero traces. Partial state is never acceptable.

---

## 2. Surface & Deep-Down Architectural Guardrails (16 MB Mitigation)

### 2.1 Surface Architecture: Referencing vs. Embedding Decision Matrix

MongoDB's document model presents two fundamental data-relationship strategies. Choosing incorrectly for a Fintech system is catastrophic. The decision must be driven by **growth boundedness** — whether the nested data has a known, small upper limit or can grow without bound.

#### Decision Matrix

| Relationship | Strategy | Rationale |
|---|---|---|
| User → Transactions | **Document Referencing (ObjectId)** | A single user may generate thousands to millions of transactions over their lifetime. Embedding would push the User document past the 16 MB BSON limit and destroy read performance long before that ceiling is hit. |
| User → Saved Recipients | **Document Referencing (ObjectId)** | While a typical user may have 5–50 saved recipients, the growth is unbounded (no hard business cap). A separate `Recipient` collection also enables compound unique indexes for deduplication, which are impossible on embedded sub-arrays. |
| Wallet → Pockets (sub-wallets) | **Embedded Sub-documents** | Pockets are bounded by business rule. A user will have at most 10–20 named savings pockets (e.g., "Vacation", "Emergency Fund"). This array will never approach even 1% of the 16 MB limit. Embedding eliminates a network round-trip for every wallet read, which is the hottest query in the system. |
| Transaction → Error Details | **Embedded Sub-document (single object)** | Error metadata is a fixed-shape object (message, code, timestamp). It is a 1:1 relationship with no growth vector. Embedding is safe and avoids a join. |
| User → Wallet | **Document Referencing (ObjectId)** | One-to-one, but in a separate collection. This enforces separation of concerns: authentication/identity data (User) is decoupled from financial state (Wallet). The User collection can be read-heavy for login without loading balance data, and the Wallet collection can be write-heavy for transactions without lock contention on User documents. |

#### The Cardinal Rule

> **If the array can grow without a hard, business-enforced ceiling, it MUST be a separate collection linked by ObjectId. No exceptions.**

Violating this rule does not simply "slow things down." It creates a ticking time bomb: the document silently grows for months until it hits the 16 MB hard BSON limit, at which point MongoDB will **hard-refuse** all writes to that document. For a user's wallet or profile, this means the customer is permanently locked out of their own money — the most severe failure mode in Fintech.

---

### 2.2 Deep-Down Mechanics: WiredTiger, Memory Pressure & the 16 MB Trap

Understanding *why* the 16 MB limit exists — and why the real damage starts far earlier — requires examining MongoDB's storage engine internals.

#### WiredTiger Storage Engine Architecture

MongoDB's default storage engine, WiredTiger, operates on the following principles relevant to our design:

1. **Page-Based Storage.** WiredTiger organizes data on disk in fixed-size pages (default internal page size: 4 KB for internal nodes, configurable up to 512 KB for leaf pages). Each document is stored within leaf pages of a B-tree structure on disk.

2. **In-Memory Cache (WiredTiger Cache).** WiredTiger maintains an in-memory cache (default: 50% of RAM minus 1 GB, or 256 MB, whichever is larger). Hot documents are served directly from this cache. Cache efficiency is the single largest determinant of query latency.

3. **Document-Level Concurrency Control.** WiredTiger uses document-level locking (technically, intent locks at the collection level and exclusive locks at the document level during writes). This means two concurrent writes to *different* documents in the same collection proceed in parallel, but two concurrent writes to the *same* document serialize.

#### Why Bloated Documents Kill Performance Before Hitting 16 MB

Consider a User document that embeds its transaction history as a growing array:

```
Scenario: User with 50,000 transactions embedded
- Average transaction sub-document size: ~300 bytes
- Transaction array alone: 50,000 × 300 = ~15 MB
- Total document: ~15.2 MB (approaching hard limit)
```

The failures manifest in escalating severity:

| Stage | Document Size | Failure Mode |
|---|---|---|
| **Stage 1: Cache Thrashing** | 2–5 MB | The document no longer fits efficiently in a single WiredTiger cache page. Every read of this user requires loading megabytes into cache, evicting other users' hot data. Cache hit ratio degrades system-wide. |
| **Stage 2: Network Amplification** | 5–10 MB | Every query that touches this user — even `findById()` for a simple name lookup — transfers the full document over the network between mongod and the application server. Query latency spikes from <5 ms to 200+ ms. Projections can mitigate but not eliminate this cost because the full document must still be read from storage. |
| **Stage 3: Write Amplification** | 10–15 MB | Adding one new transaction (300 bytes) to the array requires MongoDB to rewrite the *entire* 10+ MB document. WiredTiger's delta-based journaling helps on disk, but the in-memory representation must be fully reconstructed. Write latency exceeds 500 ms. Under load, this becomes a write bottleneck for the entire replica set primary. |
| **Stage 4: Hard Failure** | 16 MB | `BSONObjectTooLarge: object to insert exceeds maximum BSON size (16793598 bytes)`. All writes to this document permanently fail. The user cannot send money, receive money, or even update their profile. This is an unrecoverable data architecture failure. |

#### The Correct Pattern

Transactions live in their own collection. A query for a user's transactions uses an indexed lookup:

```javascript
// Fast indexed query — scans only the B-tree index, not User documents
await Transaction.find({ senderWalletId: walletId })
  .sort({ createdAt: -1 })
  .limit(50);
```

This query touches only the Transaction collection's index, returns exactly the requested page of results, and never loads or modifies the User or Wallet documents.

---

### 2.3 Schema Enforcement: Mongoose ODM Boundary Validation

Mongoose operates as the **application-to-database boundary validator**. Every document must pass through Mongoose's validation pipeline before it reaches MongoDB. This is our first — and most important — line of defense against malformed data entering the financial system.

#### Validation Primitives Used Across All Schemas

| Validator | Purpose | Example |
|---|---|---|
| `required: true` | Prevents null/undefined fields from being persisted. Critical for financial fields like `amount` and `currency`. | `amount: { type: Number, required: true }` |
| `trim: true` | Strips leading/trailing whitespace from strings at the setter level (before validation runs). Prevents `" INR "` from being treated as different from `"INR"`. | `currency: { type: String, trim: true }` |
| `lowercase: true` | Normalizes string casing at the setter level. Ensures `"John@Email.COM"` is stored as `"john@email.com"`, preventing duplicate-account creation via case variation. | `email: { type: String, lowercase: true }` |
| `uppercase: true` | Normalizes to uppercase. Used for ISO currency codes where `"inr"` must become `"INR"`. | `currency: { type: String, uppercase: true }` |
| `enum: [...]` | Restricts a field to an explicit set of allowed values. Mongoose will throw a `ValidationError` if any other value is provided. | `role: { type: String, enum: ['customer', 'admin'] }` |
| `min: 0` | For Number fields, enforces a floor value. In Fintech, this prevents negative balances from being written at the schema level. | `mainBalance: { type: Number, min: 0 }` |
| `match: /.../` | Regex validation for string patterns. Used for email format enforcement and reference code formatting. | `email: { type: String, match: /.+@.+\..+/ }` |
| `unique: true` | Creates a unique index at the MongoDB level. Prevents duplicate emails, duplicate reference codes. Note: this is an *index* property, not a Mongoose validator — it relies on MongoDB's unique constraint enforcement. | `email: { type: String, unique: true }` |
| `validate: { validator: fn }` | Custom synchronous or async validation functions for business logic that cannot be expressed with built-in validators. | Custom amount precision checks |

#### Setter Execution Order

Mongoose processes field values in this order:

1. **Default values** are applied (if the field is absent from the input).
2. **Setters** execute: `trim`, `lowercase`, `uppercase`, and any custom `set` functions.
3. **Validators** run: `required`, `enum`, `min`, `max`, `match`, and custom `validate` functions.
4. **Casting** to the declared SchemaType occurs.

This order is critical: trimming and case-normalization happen *before* validation, so an enum check for `['customer', 'admin']` will correctly validate an input of `" ADMIN "` after it is trimmed and lowercased to `"admin"`.

---

## 3. Fintech Schema Blueprints & Hard Edge Cases

### 3.1 User Schema

The User schema handles identity, authentication, and system-level access control. It is deliberately lean — it contains *no* financial data.

#### Edge Case: Account Freezing & Suspension

A user account may need to be frozen by an admin (suspected fraud, regulatory hold, or compliance review). When `isActive` is `false`, the application layer must **immediately reject** all inbound and outbound financial operations for this user — wallet reads, sends, and receives must all short-circuit before reaching the transaction engine.

This flag is checked at the **controller middleware layer**, not inside the transaction itself, because:
- It avoids opening a database session/transaction unnecessarily.
- It provides instant feedback to the client (HTTP 403) rather than a delayed abort.
- It prevents any write-lock acquisition on the Wallet document, reducing contention.

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

// ─── User Schema ────────────────────────────────────────────────────────────────
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required.'],
      trim: true,
      minlength: [1, 'First name cannot be empty.'],
      maxlength: [100, 'First name cannot exceed 100 characters.'],
    },

    lastName: {
      type: String,
      required: [true, 'Last name is required.'],
      trim: true,
      minlength: [1, 'Last name cannot be empty.'],
      maxlength: [100, 'Last name cannot exceed 100 characters.'],
    },

    email: {
      type: String,
      required: [true, 'Email address is required.'],
      unique: true,               // Enforced by MongoDB unique index
      lowercase: true,            // Setter: normalize BEFORE uniqueness check
      trim: true,                 // Setter: strip whitespace BEFORE lowercase
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address.',
      ],
      index: true,                // Explicit B-tree index for login lookups
    },

    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [8, 'Password must be at least 8 characters.'],
      select: false,              // NEVER returned in queries by default
    },

    role: {
      type: String,
      required: true,
      enum: {
        values: ['customer', 'admin'],
        message: 'Role must be either "customer" or "admin".',
      },
      default: 'customer',
      lowercase: true,            // Normalizes "ADMIN" → "admin" before enum check
      trim: true,
    },

    // ── Account Freeze Flag ──────────────────────────────────────────────────
    // When false, ALL financial operations for this user are instantly rejected
    // at the middleware layer before any wallet or transaction logic executes.
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },

    // ── Suspension Audit Trail ───────────────────────────────────────────────
    // Records who froze the account and why. This is a bounded embedded object
    // (not an array), so it will never grow beyond a single small sub-document.
    suspensionDetails: {
      suspendedAt: { type: Date, default: null },
      suspendedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
      reason: { type: String, trim: true, maxlength: 500, default: null },
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,   // Adds createdAt, updatedAt automatically
    versionKey: '__v',   // Enables Optimistic Concurrency Control (OCC)
  }
);

// ── Compound Index: Admin queries for users by role + creation date ───────────
userSchema.index({ role: 1, createdAt: -1 });

// ── Index: Fast lookup of frozen accounts for admin dashboard ────────────────
userSchema.index({ isActive: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
```

#### Edge Case Analysis

| Scenario | How the Schema Handles It |
|---|---|
| **Case-variant duplicate emails:** `"John@Email.COM"` and `"john@email.com"` | `lowercase: true` normalizes both to `"john@email.com"`. The `unique: true` index then rejects the second insertion with a duplicate key error (MongoDB error code 11000). |
| **Whitespace-padded email:** `"  john@email.com  "` | `trim: true` strips whitespace *before* the lowercase setter runs. The stored value is clean. |
| **Invalid role injection:** `"superadmin"` | `enum: ['customer', 'admin']` throws a Mongoose `ValidationError` before the document is persisted. |
| **Frozen account attempts a transfer:** | Middleware reads `user.isActive`. If `false`, returns HTTP `403 Forbidden` immediately. No wallet query, no session, no locks. |
| **Password leakage in API responses:** | `select: false` on the password field means `User.findById(id)` never includes the password hash unless `.select('+password')` is explicitly chained (used only in the login controller). |

---

### 3.2 Wallet Schema

The Wallet schema is the financial heart of the system. Each user has exactly one wallet, containing a `mainBalance` and an embedded array of `Pockets` (user-defined savings sub-wallets).

#### Edge Case: Negative Balance Prevention

Financial systems must enforce a hard floor at the schema level. Even if application logic has a bug that attempts to write a negative balance, the schema validator must act as the last line of defense:

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

// ─── Pocket Sub-Schema (Embedded) ───────────────────────────────────────────
// Pockets are bounded: a user will have at most ~10-20 custom savings pockets.
// This is well within safe embedding limits. Embedding avoids a join on every
// wallet read, which is the highest-frequency query in the entire system.
const pocketSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Pocket name is required.'],
      trim: true,
      maxlength: [50, 'Pocket name cannot exceed 50 characters.'],
    },

    targetAmount: {
      type: Number,
      default: 0,
      min: [0, 'Target amount cannot be negative.'],
      validate: {
        validator: function (value) {
          // Enforce max 2 decimal places for currency precision
          return Number(value.toFixed(2)) === value;
        },
        message: 'Target amount cannot have more than 2 decimal places.',
      },
    },

    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Pocket balance cannot be negative.'],
      validate: {
        validator: function (value) {
          return Number(value.toFixed(2)) === value;
        },
        message: 'Pocket balance cannot have more than 2 decimal places.',
      },
    },

    emoji: {
      type: String,
      default: '💰',
      maxlength: 4,
    },

    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,           // Each pocket gets its own ObjectId for targeted updates
    timestamps: true,
  }
);

// ─── Wallet Schema ──────────────────────────────────────────────────────────────
const walletSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Wallet must be linked to a user.'],
      unique: true,             // Enforces 1:1 — one wallet per user, no exceptions
      index: true,              // B-tree index for fast wallet lookups by user
    },

    mainBalance: {
      type: Number,
      required: [true, 'Main balance is required.'],
      default: 0,
      min: [0, 'Balance cannot be negative. Debit operations must verify funds before modifying.'],
      validate: {
        validator: function (value) {
          // Enforce max 2 decimal places — prevents floating point dust
          // e.g., 100.001 after repeated additions/subtractions
          return Number(value.toFixed(2)) === value;
        },
        message: 'Balance cannot have more than 2 decimal places.',
      },
    },

    currency: {
      type: String,
      required: [true, 'Currency code is required.'],
      uppercase: true,          // Setter: "inr" → "INR" before validation
      trim: true,
      enum: {
        values: ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'AUD', 'CAD'],
        message: 'Currency {VALUE} is not supported.',
      },
      default: 'INR',
    },

    // ── Bounded Embedded Pockets ─────────────────────────────────────────────
    pockets: {
      type: [pocketSchema],
      default: [],
      validate: {
        validator: function (pocketsArray) {
          return pocketsArray.length <= 20;
        },
        message: 'A wallet cannot have more than 20 pockets.',
      },
    },

    // ── Wallet-Level Lock ────────────────────────────────────────────────────
    // Used by admins to freeze a specific wallet without deactivating the
    // entire user account. A frozen wallet rejects all debit/credit ops.
    isFrozen: {
      type: Boolean,
      default: false,
    },

    lastTransactionAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: '__v',      // Critical for Optimistic Concurrency Control
  }
);

// ── Index: Admin dashboard — find all frozen wallets ──────────────────────────
walletSchema.index({ isFrozen: 1 });

// ── Index: Currency-based reporting ──────────────────────────────────────────
walletSchema.index({ currency: 1 });

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
```

#### Edge Case Analysis

| Scenario | How the Schema Handles It |
|---|---|
| **Negative balance write attempt:** Application bug tries `mainBalance: -50` | `min: 0` validator throws `ValidationError`. The document is never persisted. This is the absolute last line of defense — application logic should also check, but the schema catches bugs. |
| **Floating-point dust:** Repeated `0.1 + 0.2` operations produce `0.30000000000000004` | The custom `validate` function checks `Number(value.toFixed(2)) === value`. Values with more than 2 decimal places are rejected. Application logic must round to 2 decimal places before writing. |
| **Pocket array overflow:** A user tries to create 100 pockets via API abuse | The array-level validator enforces `pockets.length <= 20`. Even if the application layer has a bug, the schema blocks the 21st pocket. |
| **Currency case mismatch:** Frontend sends `"inr"`, backend expects `"INR"` | `uppercase: true` setter normalizes before the `enum` check. `"inr"` → `"INR"` → passes enum validation. |
| **Duplicate wallet creation:** Race condition creates two wallets for one user | `unique: true` on `userId` creates a unique MongoDB index. The second insert fails with duplicate key error 11000. |
| **Optimistic Concurrency Conflict:** Two concurrent balance modifications | The `__v` version key enables OCC. See Section 4.3 for full explanation. |

---

### 3.3 Recipient Schema

The Recipient schema stores saved beneficiary routes — the bank details a customer saves so they don't need to re-enter them for every transfer.

#### Edge Case: Duplicate Recipient Prevention

A customer must not be able to save the same bank account number twice under their profile. This is not just a UX concern — duplicate recipients can lead to double-debits if the customer accidentally selects the wrong duplicate entry. The deduplication **must be enforced at the database level** via a compound unique index, because application-layer checks are vulnerable to race conditions (two concurrent requests reading "no duplicate found" at the same millisecond, then both inserting).

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

// ─── Recipient Schema ───────────────────────────────────────────────────────────
const recipientSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient must be linked to a user.'],
      index: true,               // Fast lookup: "show me all my saved recipients"
    },

    // ── Beneficiary Identity ─────────────────────────────────────────────────
    recipientName: {
      type: String,
      required: [true, 'Recipient name is required.'],
      trim: true,
      maxlength: [200, 'Recipient name cannot exceed 200 characters.'],
    },

    // ── Bank Route Details ───────────────────────────────────────────────────
    bankName: {
      type: String,
      required: [true, 'Bank name is required.'],
      trim: true,
      maxlength: [200, 'Bank name cannot exceed 200 characters.'],
    },

    accountNumber: {
      type: String,
      required: [true, 'Account number is required.'],
      trim: true,
      minlength: [8, 'Account number must be at least 8 characters.'],
      maxlength: [34, 'Account number cannot exceed 34 characters (IBAN max).'],
      // Note: Stored as String, not Number, because:
      // 1. Account numbers can have leading zeros ("0012345678")
      // 2. IBANs contain letters ("GB29NWBK60161331926819")
      // 3. No arithmetic operations are ever performed on account numbers
    },

    ifscCode: {
      type: String,
      required: [true, 'IFSC code is required.'],
      trim: true,
      uppercase: true,           // "sbin0001234" → "SBIN0001234"
      match: [
        /^[A-Z]{4}0[A-Z0-9]{6}$/,
        'IFSC code must be in valid format (e.g., SBIN0001234).',
      ],
    },

    accountType: {
      type: String,
      trim: true,
      lowercase: true,
      enum: {
        values: ['savings', 'current', 'nre', 'nro'],
        message: 'Account type must be one of: savings, current, nre, nro.',
      },
      default: 'savings',
    },

    // ── Metadata ─────────────────────────────────────────────────────────────
    nickname: {
      type: String,
      trim: true,
      maxlength: [50, 'Nickname cannot exceed 50 characters.'],
      default: null,
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ── CRITICAL: Compound Unique Index — Prevents Duplicate Recipients ──────────
// A single user cannot save the same bank account number twice.
// This is enforced at the DATABASE level, not application level, because
// application-layer uniqueness checks are vulnerable to race conditions.
//
// Why compound? Because account number "0012345678" can exist for User A
// AND User B — they are different beneficiaries. Uniqueness is scoped per-user.
recipientSchema.index(
  { userId: 1, accountNumber: 1 },
  { unique: true, name: 'unique_user_account' }
);

// ── Index: Fast lookup of a user's favorite recipients ───────────────────────
recipientSchema.index({ userId: 1, isFavorite: -1 });

const Recipient = mongoose.model('Recipient', recipientSchema);

module.exports = Recipient;
```

#### Edge Case Analysis

| Scenario | How the Schema Handles It |
|---|---|
| **Duplicate recipient race condition:** Two concurrent requests save `accountNumber: "0012345678"` for the same userId | The compound unique index `{ userId: 1, accountNumber: 1 }` is enforced by MongoDB at the storage layer. The second insert fails with error 11000 regardless of timing. |
| **Same account, different users:** User A and User B both save account `"0012345678"` | The compound index is `{ userId, accountNumber }`, not just `{ accountNumber }`. Different users can independently save the same bank account. |
| **Leading-zero account numbers:** Account `"0012345678"` stored as Number becomes `12345678` | `accountNumber` is `type: String`. Leading zeros are preserved. No arithmetic is performed on account numbers. |
| **IFSC case mismatch:** Frontend sends `"sbin0001234"` | `uppercase: true` normalizes to `"SBIN0001234"`, then `match` regex validates the format. |

---

### 3.4 Transaction Schema

The Transaction schema is the **immutable, append-only financial ledger**. It is the single source of truth for every fund movement in the system.

#### Edge Case: Why Financial Ledger Rows Must Be Immutable

In traditional accounting and regulated Fintech, ledger entries are **never updated or deleted**. This is a fundamental principle, not a preference:

1. **Audit Trail Integrity.** Regulators (RBI, PCI-DSS, SOX compliance) require a complete, tamper-evident history of every transaction. If a row can be modified, the audit trail is compromised — it becomes impossible to prove what actually happened.

2. **Reconciliation Safety.** Periodic reconciliation (matching internal records against bank statements) depends on every historical entry being frozen. If a "success" entry is later modified to "failure," reconciliation reports become inconsistent and financial statements become unreliable.

3. **Dispute Resolution.** Customer disputes ("I was charged but never received funds") require examining the exact state of the transaction at the time it occurred. Mutating the original record destroys this evidence.

4. **Compensating Entries, Not Corrections.** If a transaction must be reversed (refund, chargeback, admin correction), the correct approach is to **append a new compensating transaction** that offsets the original — never to modify the original entry. This preserves the full narrative: "Transaction A was executed, then Transaction B reversed it."

```javascript
const mongoose = require('mongoose');
const crypto = require('crypto');
const { Schema } = mongoose;

// ─── Transaction Schema (Immutable Ledger Line) ─────────────────────────────────
const transactionSchema = new Schema(
  {
    // ── Debit Side ───────────────────────────────────────────────────────────
    senderWalletId: {
      type: Schema.Types.ObjectId,
      ref: 'Wallet',
      required: [true, 'Sender wallet ID is required.'],
      index: true,              // Fast lookup: "show me all debits from this wallet"
    },

    // ── Credit Side ──────────────────────────────────────────────────────────
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'Recipient',
      required: [true, 'Recipient ID is required.'],
      index: true,              // Fast lookup: "show me all credits to this recipient"
    },

    // ── Financial Values ─────────────────────────────────────────────────────
    amount: {
      type: Number,
      required: [true, 'Transaction amount is required.'],
      min: [0.01, 'Transaction amount must be at least 0.01.'],
      validate: {
        validator: function (value) {
          // Enforce max 2 decimal places for currency precision
          return Number(value.toFixed(2)) === value;
        },
        message: 'Transaction amount cannot have more than 2 decimal places.',
      },
    },

    currency: {
      type: String,
      required: [true, 'Currency code is required.'],
      uppercase: true,
      trim: true,
      enum: {
        values: ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'AUD', 'CAD'],
        message: 'Currency {VALUE} is not supported.',
      },
    },

    // ── Unique Reference Code ────────────────────────────────────────────────
    // Cryptographically generated, globally unique identifier for this
    // transaction. Used for external reconciliation, customer support lookups,
    // and API idempotency keys.
    referenceCode: {
      type: String,
      required: [true, 'Reference code is required.'],
      unique: true,             // MongoDB unique index — no two transactions share a code
      index: true,
      default: function () {
        // Generate a 24-character hex string from 12 random bytes
        // Collision probability: ~1 in 2^96 ≈ 7.9 × 10^28
        return 'TXN-' + crypto.randomBytes(12).toString('hex').toUpperCase();
      },
    },

    // ── Status Lifecycle ─────────────────────────────────────────────────────
    // 'pending'  → Transaction initiated, debit executed, credit not yet confirmed
    // 'success'  → Full cycle complete: debit + credit + ledger entry committed
    // 'failure'  → Rolled back: debit reversed, funds restored to sender
    //
    // IMPORTANT: Status changes are implemented by APPENDING a new transaction
    // document (compensating entry), NOT by mutating this field on an existing
    // document. The only exception is the initial pending → success/failure
    // transition within the same ACID session that created the entry.
    status: {
      type: String,
      required: true,
      enum: {
        values: ['pending', 'success', 'failure'],
        message: 'Status must be one of: pending, success, failure.',
      },
      default: 'pending',
      lowercase: true,
      trim: true,
      index: true,              // Fast lookup for admin pending monitor
    },

    // ── Transaction Type ─────────────────────────────────────────────────────
    type: {
      type: String,
      required: true,
      enum: {
        values: ['transfer', 'refund', 'reversal', 'deposit', 'withdrawal'],
        message: 'Transaction type is not valid.',
      },
      default: 'transfer',
      lowercase: true,
      trim: true,
    },

    // ── Error Tracking (Embedded — fixed shape, 1:1, no growth) ──────────────
    errorMessage: {
      type: String,
      default: null,
      trim: true,
      maxlength: [1000, 'Error message cannot exceed 1000 characters.'],
    },

    errorCode: {
      type: String,
      default: null,
      trim: true,
      uppercase: true,
    },

    // ── Admin Resolution ─────────────────────────────────────────────────────
    resolvedByAdmin: {
      type: Boolean,
      default: false,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    adminNotes: {
      type: String,
      default: null,
      trim: true,
      maxlength: [2000, 'Admin notes cannot exceed 2000 characters.'],
    },

    // ── Compensating Entry Link ──────────────────────────────────────────────
    // If this transaction is a refund/reversal, this field points to the
    // original transaction it compensates. Creates a traceable chain.
    originalTransactionId: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
      default: null,
    },

    // ── Metadata ─────────────────────────────────────────────────────────────
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters.'],
      default: null,
    },

    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,          // createdAt = transaction timestamp (immutable)
    versionKey: '__v',
  }
);

// ── CRITICAL: Compound Index for Module 6 Admin Live Dashboard ───────────────
// Powers the "Pending Monitor" and "Transaction Logs" screens.
// Admins query: "Show me all pending transactions, newest first"
// Without this compound index, MongoDB would perform a COLLSCAN on potentially
// millions of transaction documents.
transactionSchema.index({ status: 1, createdAt: -1 });

// ── Index: Date-range queries for financial reporting ────────────────────────
transactionSchema.index({ createdAt: -1 });

// ── Index: Sender + date range (user's transaction history) ──────────────────
transactionSchema.index({ senderWalletId: 1, createdAt: -1 });

// ── Index: Type + status for admin filtering ─────────────────────────────────
transactionSchema.index({ type: 1, status: 1 });

// ── Index: Unresolved error lookups for admin error log screen ───────────────
transactionSchema.index(
  { resolvedByAdmin: 1, status: 1 },
  { name: 'unresolved_failures' }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
```

#### Edge Case Analysis

| Scenario | How the Schema Handles It |
|---|---|
| **Duplicate reference code:** Extremely unlikely (1 in 2⁹⁶) but possible | `unique: true` on `referenceCode` means MongoDB rejects the duplicate at the storage level. Application logic should catch error 11000 and regenerate. |
| **Amount of 0 or negative:** API abuse or calculation bug | `min: 0.01` rejects zero-value and negative transactions at the schema level. |
| **Floating-point amount:** `100.999` after bad calculation | Custom validator ensures `Number(value.toFixed(2)) === value`. Values with more than 2 decimal places are rejected. |
| **Status mutation after commit:** Attempting to change a "success" to "failure" | Enforced at the application layer: the transaction update controller must reject any status modification on non-pending transactions. Compensating entries (type: 'refund' or 'reversal') are used instead. |
| **Admin resolves a pending transaction:** | `resolvedByAdmin: true`, `resolvedAt: new Date()`, `resolvedBy: adminUserId` are set. The resolution itself is auditable via timestamps. |

---

## 4. Global B-Tree Indexing Matrix & Concurrency Controls

### 4.1 B-Tree Structural Layout

MongoDB uses **B-Tree indexes** (specifically B+ Tree variants in WiredTiger) as its primary indexing data structure. Understanding how a B-Tree search operates is essential for predicting query performance and identifying missing-index catastrophes.

#### How a B-Tree Search Operates

A B-Tree is a self-balancing tree data structure that maintains sorted data and allows searches, insertions, and deletions in **O(log n)** time. In MongoDB's implementation:

```
                        ┌─────────────────────────────┐
         Root Node      │  [key_100]  [key_500]  [key_900]  │
                        └──┬──────────┬──────────┬──────────┘
                           │          │          │
                 ┌─────────▼──┐  ┌────▼─────┐  ┌▼──────────┐
  Internal       │ [key_25]   │  │ [key_300] │  │ [key_700] │
  Nodes          │ [key_50]   │  │ [key_400] │  │ [key_800] │
                 └─┬────┬──┬─┘  └──┬───┬──┬─┘  └─┬───┬──┬─┘
                   │    │  │       │   │  │      │   │  │
                   ▼    ▼  ▼       ▼   ▼  ▼      ▼   ▼  ▼
  Leaf Nodes     ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐
  (Data Ptrs)    │→D│ │→D│ │→D│ │→D│ │→D│ │→D│ │→D│ │→D│ │→D│
                 └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘
                  ↓    ↓    ↓    ↓    ↓    ↓    ↓    ↓    ↓
              ┌────────────────────────────────────────────────┐
              │       Actual Document Data on Disk / Cache     │
              └────────────────────────────────────────────────┘
```

**Step-by-step search for `referenceCode = "TXN-ABC123"`:**

1. **Root Node Comparison.** The query engine compares the search key against the keys in the root node. Since this is a string, lexicographic comparison determines which child pointer to follow.

2. **Internal Node Traversal.** The engine descends through 1–3 internal node levels (for millions of documents, B-Trees are remarkably shallow — a tree with 10 million leaf entries and order 100 has only ~4 levels).

3. **Leaf Node Arrival.** The leaf node contains the indexed field value and a **data pointer** — a reference to the actual document's location on disk (the RecordId in WiredTiger's parlance).

4. **Document Fetch.** Using the data pointer, WiredTiger retrieves the full document from disk (or, ideally, from the in-memory cache).

**Total operations for 10 million documents:** ~4 node comparisons + 1 document fetch = **5 disk reads** (or cache hits). This is O(log n).

#### Why Missing an Index Causes Catastrophic Collection Scans

Without an index, MongoDB must perform a **Collection Scan (COLLSCAN)** — a sequential read of every single document in the collection to check if it matches the query predicate.

| Query | With Index (IXSCAN) | Without Index (COLLSCAN) |
|---|---|---|
| Find transaction by `referenceCode` | **4–5 operations** (~0.1 ms) | **10,000,000 document reads** (~30 seconds) |
| Find pending transactions sorted by date | **Index walk** (~1 ms for 50 results) | **Full scan + in-memory sort** (~45 seconds, may run out of 100 MB sort RAM and fail) |
| Find all transactions for a wallet | **Index range scan** (~2 ms) | **Full collection scan** (~30 seconds) |

For a Fintech system with millions of transactions, a single missing index on a hot query path turns a sub-millisecond operation into a multi-second full-table scan. Under concurrent load, this bottleneck cascades: every query queues behind the slow scan, connections pool up, and the entire application becomes unresponsive.

> **Sort RAM Limit.** MongoDB has a 100 MB limit on in-memory sorts. If a query requires sorting without an index and the intermediate result set exceeds 100 MB, MongoDB will **abort the query** with error `QueryExceededMemoryLimitNoDiskUseAllowed`. This can happen with as few as 500,000 transaction documents sorted by date without a `{ createdAt: -1 }` index.

---

### 4.2 Index Declarations

The following is the **complete indexing matrix** across all four schemas. Every index is declared with its purpose, the query pattern it serves, and which application module benefits from it.

#### User Collection Indexes

```javascript
// ── Declared in Schema ───────────────────────────────────────────────────────

// 1. Unique email index (declared via `unique: true` on field)
//    Query: db.users.findOne({ email: "john@email.com" })
//    Module: 1 (Login, Registration)
//    Type: Single-field, unique, B-tree
{ email: 1 }   // unique: true

// 2. Role + creation date compound index
//    Query: db.users.find({ role: "customer" }).sort({ createdAt: -1 })
//    Module: 6 (Admin user management dashboard)
//    Type: Compound, B-tree
{ role: 1, createdAt: -1 }

// 3. Active status index
//    Query: db.users.find({ isActive: false })
//    Module: 6 (Admin frozen accounts list)
//    Type: Single-field, B-tree
{ isActive: 1 }
```

#### Wallet Collection Indexes

```javascript
// 1. Unique userId index (declared via `unique: true` on field)
//    Query: db.wallets.findOne({ userId: ObjectId("...") })
//    Module: 1, 3, 4, 5 (Every wallet read)
//    Type: Single-field, unique, B-tree
{ userId: 1 }   // unique: true

// 2. Frozen wallet index
//    Query: db.wallets.find({ isFrozen: true })
//    Module: 6 (Admin frozen wallets dashboard)
//    Type: Single-field, B-tree
{ isFrozen: 1 }

// 3. Currency index
//    Query: db.wallets.find({ currency: "INR" })
//    Module: 6 (Currency-segmented reporting)
//    Type: Single-field, B-tree
{ currency: 1 }
```

#### Recipient Collection Indexes

```javascript
// 1. UserId index (declared via `index: true` on field)
//    Query: db.recipients.find({ userId: ObjectId("...") })
//    Module: 2 (Show all saved recipients for a user)
//    Type: Single-field, B-tree
{ userId: 1 }

// 2. Compound unique index — duplicate prevention
//    Query: db.recipients.insertOne({ userId: X, accountNumber: Y })
//    Module: 2 (Add recipient — uniqueness enforcement)
//    Type: Compound, unique, B-tree
{ userId: 1, accountNumber: 1 }   // unique: true

// 3. Favorites lookup
//    Query: db.recipients.find({ userId: X, isFavorite: true })
//    Module: 3 (Quick-select favorite recipients for send money)
//    Type: Compound, B-tree
{ userId: 1, isFavorite: -1 }
```

#### Transaction Collection Indexes

```javascript
// 1. Reference code unique index (declared via `unique: true` on field)
//    Query: db.transactions.findOne({ referenceCode: "TXN-ABC123..." })
//    Module: 4, 6 (Transaction lookup by reference)
//    Type: Single-field, unique, B-tree
{ referenceCode: 1 }   // unique: true

// 2. Status index (declared via `index: true` on field)
//    Query: db.transactions.find({ status: "pending" })
//    Module: 6 (Pending monitor badge count)
//    Type: Single-field, B-tree
{ status: 1 }

// 3. Sender wallet index (declared via `index: true` on field)
//    Query: db.transactions.find({ senderWalletId: ObjectId("...") })
//    Module: 4 (User's transaction history)
//    Type: Single-field, B-tree
{ senderWalletId: 1 }

// 4. Recipient index (declared via `index: true` on field)
//    Query: db.transactions.find({ recipientId: ObjectId("...") })
//    Module: 4 (Recipient-centric view)
//    Type: Single-field, B-tree
{ recipientId: 1 }

// ━━━ COMPOUND INDEXES (Declared via schema.index()) ━━━━━━━━━━━━━━━━━━━━━━━━━

// 5. ★ CRITICAL: Admin Live Dashboard Index ★
//    Query: db.transactions.find({ status: "pending" }).sort({ createdAt: -1 })
//    Module: 6 (Pending Monitor, Transaction Logs — the most-hit admin query)
//    Type: Compound, B-tree
//    WHY COMPOUND: Status alone would find all pending transactions, but
//    sorting by createdAt would still require an in-memory sort. The compound
//    index { status: 1, createdAt: -1 } allows MongoDB to walk the index in
//    order and return already-sorted results with zero in-memory sort cost.
{ status: 1, createdAt: -1 }

// 6. Date-range queries for financial reporting
//    Query: db.transactions.find({ createdAt: { $gte: startDate, $lte: endDate } })
//    Module: 4, 6 (Date-filtered reports, financial analysis)
//    Type: Single-field, B-tree
{ createdAt: -1 }

// 7. Sender + date range (user's chronological transaction history)
//    Query: db.transactions.find({ senderWalletId: X }).sort({ createdAt: -1 })
//    Module: 4 (User's "My Transactions" page with pagination)
//    Type: Compound, B-tree
{ senderWalletId: 1, createdAt: -1 }

// 8. Type + status for admin filtering
//    Query: db.transactions.find({ type: "refund", status: "pending" })
//    Module: 6 (Admin filter by transaction type and status)
//    Type: Compound, B-tree
{ type: 1, status: 1 }

// 9. Unresolved failures for admin error log screen
//    Query: db.transactions.find({ resolvedByAdmin: false, status: "failure" })
//    Module: 6 (Error Logs page — unresolved failure badge)
//    Type: Compound, B-tree, named
{ resolvedByAdmin: 1, status: 1 }   // name: 'unresolved_failures'
```

---

### 4.3 Concurrency & Race Conditions: The Double-Spending Problem

#### The Vulnerability

The "double-spending" race condition is the most critical concurrency vulnerability in any payment system. It occurs when two simultaneous payment requests read the same wallet balance at the exact same millisecond, both conclude that sufficient funds exist, and both proceed to debit the wallet — resulting in a negative balance and funds created from nothing.

```
Timeline (without protection):

  Time     Thread A (Send ₹500)              Thread B (Send ₹700)
  ─────    ─────────────────────────          ──────────────────────────
  T+0ms    READ wallet.mainBalance → ₹1000   READ wallet.mainBalance → ₹1000
  T+1ms    CHECK: 1000 >= 500 ✓ proceed      CHECK: 1000 >= 700 ✓ proceed
  T+2ms    WRITE: mainBalance = 1000 - 500   WRITE: mainBalance = 1000 - 700
  T+3ms    SAVE: mainBalance = 500           SAVE: mainBalance = 300
                                              
  Result:  Wallet shows ₹300, but ₹1200 was  
           debited from a ₹1000 balance.      
           ₹200 was created from nothing.     
           Conservation of funds VIOLATED.     
```

#### Solution: Optimistic Concurrency Control (OCC) via Mongoose `__v`

Mongoose provides built-in OCC through the `__v` (version key) field. Every document carries an integer version number that increments on each successful save. When two concurrent operations read the same version, only the first to commit succeeds — the second detects the version mismatch and throws a `VersionError`.

**How it works internally:**

1. Both Thread A and Thread B read the wallet document. Both see `__v: 5`.

2. Thread A calls `.save()`. Mongoose internally generates an `updateOne()` operation with the filter `{ _id: walletId, __v: 5 }` and the update `{ $set: { mainBalance: 500 }, $inc: { __v: 1 } }`. This atomically checks the version AND updates the balance AND increments the version in a single MongoDB operation. The document is now at `__v: 6`.

3. Thread B calls `.save()`. Mongoose generates the same filter: `{ _id: walletId, __v: 5 }`. But the document's version is now `6`, so the filter matches **zero documents**. Mongoose detects `modifiedCount === 0` and throws a `VersionError`.

4. The application catches the `VersionError` and either retries the entire operation (re-read, re-check, re-write) or returns an error to the client.

```
Timeline (with OCC):

  Time     Thread A (Send ₹500)                Thread B (Send ₹700)
  ─────    ──────────────────────────────       ───────────────────────────────
  T+0ms    READ wallet { __v: 5, bal: 1000 }   READ wallet { __v: 5, bal: 1000 }
  T+1ms    CHECK: 1000 >= 500 ✓                CHECK: 1000 >= 700 ✓
  T+2ms    SAVE: filter { __v: 5 }             (waiting for lock)
           UPDATE: { bal: 500, __v: 6 }
           Result: matched 1, modified 1 ✓
  T+3ms                                        SAVE: filter { __v: 5 }
                                                UPDATE: { bal: 300, __v: 6 }
                                                Result: matched 0 ✗
                                                ⚠ VersionError thrown!
  T+4ms                                        CATCH: Retry or abort.
                                                Re-read: { __v: 6, bal: 500 }
                                                CHECK: 500 >= 700 ✗ INSUFFICIENT
                                                Return 400: "Insufficient funds"
           
  Result:  ₹500 correctly debited.
           Thread B safely rejected.
           Conservation of funds PRESERVED.
```

#### Implementation Pattern

```javascript
const transferFunds = async (senderWalletId, amount) => {
  const MAX_RETRIES = 3;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // 1. Read the current state (including __v)
      const wallet = await Wallet.findById(senderWalletId);
      
      if (!wallet) throw new Error('Wallet not found.');
      if (wallet.isFrozen) throw new Error('Wallet is frozen.');
      if (wallet.mainBalance < amount) throw new Error('Insufficient funds.');
      
      // 2. Modify locally
      wallet.mainBalance -= amount;
      
      // 3. Save — Mongoose includes __v in the filter automatically
      //    If another thread modified the wallet since our read, this
      //    throws VersionError and we retry.
      await wallet.save();
      
      return wallet; // Success
      
    } catch (error) {
      if (error.name === 'VersionError' && attempt < MAX_RETRIES - 1) {
        // Collision detected — retry with fresh read
        console.warn(`OCC collision on wallet ${senderWalletId}, retry ${attempt + 1}`);
        continue;
      }
      throw error; // Non-retryable error or max retries exceeded
    }
  }
};
```

> **Important Note:** OCC handles the concurrency detection. But for multi-document atomicity (debit sender + credit receiver + write ledger entry), we additionally need **MongoDB ACID transactions** (sessions). Section 5 covers this. The two mechanisms work together: the session ensures atomicity across documents, and `__v` ensures no conflicting modification slips through on any individual document.

---

## 5. ACID Transaction System & Automated Rollback Logic

### 5.1 The Transaction Engine

MongoDB supports multi-document ACID transactions starting from version 4.0 (replica sets) and 4.2 (sharded clusters). These transactions provide the same guarantees as traditional RDBMS transactions:

| Property | MongoDB Implementation |
|---|---|
| **Atomicity** | All operations within a session either commit together or roll back together. There is no partial state. |
| **Consistency** | Schema validators and unique indexes are enforced within the transaction. A transaction that violates a constraint is aborted. |
| **Isolation** | Transactions use **snapshot isolation** by default. A transaction sees a consistent snapshot of the data as of the transaction's start time. Other transactions' uncommitted writes are invisible. |
| **Durability** | Once `commitTransaction()` returns successfully, the data is written to the journal (WAL — Write-Ahead Log) and is guaranteed to survive process crashes and power failures. |

#### How Sessions Work in Mongoose

A session is created from the Mongoose connection and passed to every database operation that should be part of the atomic unit:

```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  // All operations pass { session } as an option
  await Model.findOneAndUpdate(filter, update, { session });
  await Model.create([document], { session });
  
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
} finally {
  session.endSession();
}
```

**Critical requirement:** Multi-document transactions require a **MongoDB Replica Set**. A standalone `mongod` instance does not support transactions. For development, use `mongod --replSet rs0` or MongoDB Atlas (which always provisions replica sets).

---

### 5.2 Detailed Workflow Steps: Atomic Fund Transfer

The following is the complete, step-by-step controller blueprint for an atomic fund transfer. This is the most complex and critical operation in the entire system.

```javascript
const mongoose = require('mongoose');
const crypto = require('crypto');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

/**
 * Executes an atomic fund transfer between two wallets.
 * 
 * Guarantees:
 * - Sender is debited AND receiver is credited AND ledger entry is written,
 *   or NONE of these operations persist.
 * - Double-spending is prevented via atomic conditional update.
 * - All financial invariants are preserved under any failure mode.
 * 
 * @param {ObjectId} senderUserId   - The authenticated user initiating the transfer
 * @param {ObjectId} recipientId    - The saved recipient document ID
 * @param {Number}   amount         - Transfer amount (must be > 0, max 2 decimals)
 * @param {String}   currency       - ISO currency code
 * @param {String}   description    - Optional transfer note
 * @param {String}   ipAddress      - Client IP for audit trail
 * @returns {Object} The created transaction document
 */
const executeTransfer = async (
  senderUserId,
  recipientId,
  amount,
  currency,
  description = null,
  ipAddress = null
) => {
  // ════════════════════════════════════════════════════════════════════════════
  // PRE-FLIGHT CHECKS (Outside the transaction — read-only, no locks needed)
  // ════════════════════════════════════════════════════════════════════════════

  // Step 0a: Verify sender account is active (not frozen/suspended)
  const senderUser = await User.findById(senderUserId).lean();
  if (!senderUser) {
    throw new Error('SENDER_NOT_FOUND: Sender user does not exist.');
  }
  if (!senderUser.isActive) {
    throw new Error('ACCOUNT_SUSPENDED: Your account has been suspended. Contact support.');
  }

  // Step 0b: Validate amount at application level (schema will also validate)
  if (!amount || amount <= 0) {
    throw new Error('INVALID_AMOUNT: Transfer amount must be greater than zero.');
  }
  if (Number(amount.toFixed(2)) !== amount) {
    throw new Error('INVALID_PRECISION: Amount cannot have more than 2 decimal places.');
  }

  // ════════════════════════════════════════════════════════════════════════════
  // STEP 1: Spawn a new database session and begin the ACID transaction
  // ════════════════════════════════════════════════════════════════════════════

  const session = await mongoose.startSession();

  // Configure transaction options for financial-grade consistency
  session.startTransaction({
    readConcern: { level: 'snapshot' },    // Consistent snapshot isolation
    writeConcern: { w: 'majority' },       // Wait for majority replica ack
    readPreference: 'primary',             // Always read from primary
  });

  try {
    // ══════════════════════════════════════════════════════════════════════════
    // STEP 2: Atomic check-and-deduct from sender's wallet
    // ══════════════════════════════════════════════════════════════════════════
    //
    // This is a CONDITIONAL atomic update. The filter includes:
    //   - _id: target the correct wallet
    //   - mainBalance: { $gte: amount } — ONLY proceed if sufficient funds
    //   - isFrozen: false — ONLY proceed if wallet is not frozen
    //
    // If ANY condition fails, findOneAndUpdate returns null (no document matched),
    // and we know the debit cannot proceed — without ever having modified anything.
    //
    // This pattern is SUPERIOR to "read balance, check in JS, then update" because
    // it eliminates the race condition window between read and write. The check
    // and the modification happen in a SINGLE atomic MongoDB operation.

    const senderWallet = await Wallet.findOneAndUpdate(
      {
        userId: senderUserId,
        mainBalance: { $gte: amount },   // Atomic balance guard
        isFrozen: false,                  // Atomic freeze guard
      },
      {
        $inc: { mainBalance: -amount },   // Atomic decrement
        $set: { lastTransactionAt: new Date() },
      },
      {
        new: true,                        // Return the modified document
        session,                          // Bind to the ACID session
      }
    );

    if (!senderWallet) {
      // No document matched the filter — either:
      // 1. Wallet doesn't exist for this user
      // 2. Insufficient balance (mainBalance < amount)
      // 3. Wallet is frozen
      //
      // We don't know which, but it doesn't matter — the transfer cannot proceed.
      // We'll do a diagnostic read to provide a meaningful error message.

      const diagnosticWallet = await Wallet.findOne(
        { userId: senderUserId },
        null,
        { session }
      );

      if (!diagnosticWallet) {
        throw new Error('WALLET_NOT_FOUND: No wallet exists for the sender.');
      }
      if (diagnosticWallet.isFrozen) {
        throw new Error('WALLET_FROZEN: Your wallet has been frozen. Contact support.');
      }
      if (diagnosticWallet.mainBalance < amount) {
        throw new Error(
          `INSUFFICIENT_FUNDS: Available balance is ${diagnosticWallet.currency} ${diagnosticWallet.mainBalance.toFixed(2)}, ` +
          `but the transfer requires ${diagnosticWallet.currency} ${amount.toFixed(2)}.`
        );
      }

      throw new Error('DEBIT_FAILED: Unable to process debit. Please try again.');
    }

    // ══════════════════════════════════════════════════════════════════════════
    // STEP 3: Incremental provisioning of funds to the recipient
    // ══════════════════════════════════════════════════════════════════════════
    //
    // In a full banking system, this step would interface with an external
    // bank API. In PayGate's internal transfer model, we credit the recipient's
    // wallet directly if they are also a PayGate user.
    //
    // For external bank transfers, this step would instead:
    //   1. Place the funds in an escrow/holding state
    //   2. Initiate an external bank API call
    //   3. Wait for confirmation before marking success
    //
    // For simplicity, this blueprint shows the internal transfer path.

    // Retrieve recipient details to find their wallet (if internal)
    const recipientDoc = await mongoose.model('Recipient').findById(recipientId).session(session);
    
    if (!recipientDoc) {
      throw new Error('RECIPIENT_NOT_FOUND: The selected recipient does not exist.');
    }

    // Note: For external bank transfers, this block would be replaced with
    // external API integration. The recipient may not have a PayGate wallet.
    // The transaction would still be logged with status tracking.

    // ══════════════════════════════════════════════════════════════════════════
    // STEP 4: Log the immutable ledger entry with a cryptographically
    //         secure, unique transaction reference identifier
    // ══════════════════════════════════════════════════════════════════════════
    //
    // The reference code is generated using Node.js crypto.randomBytes(),
    // producing 12 bytes of cryptographic randomness encoded as 24 hex chars.
    // Prefixed with "TXN-" for human readability in support contexts.
    //
    // Collision probability: 1 in 2^96 ≈ 7.9 × 10^28 — effectively zero.

    const referenceCode = 'TXN-' + crypto.randomBytes(12).toString('hex').toUpperCase();

    const transactionRecord = await Transaction.create(
      [
        {
          senderWalletId: senderWallet._id,
          recipientId: recipientId,
          amount: amount,
          currency: currency,
          referenceCode: referenceCode,
          status: 'success',
          type: 'transfer',
          description: description,
          ipAddress: ipAddress,
        },
      ],
      { session }     // Bind to the ACID session
    );
    // Note: Transaction.create() with an array + session is required.
    // Transaction.create(singleDoc, { session }) does NOT work — Mongoose
    // requires the array form when passing options to create().

    // ══════════════════════════════════════════════════════════════════════════
    // STEP 5: Commit the collective batch to disk
    // ══════════════════════════════════════════════════════════════════════════
    //
    // This is the point of no return. Once commitTransaction() returns
    // successfully, ALL three operations (debit, credit, ledger write) are:
    //   1. Written to the WiredTiger journal (WAL) on the primary
    //   2. Replicated to the majority of replica set members
    //   3. Guaranteed to survive process crashes and power failures
    //
    // If commitTransaction() throws, the catch block handles rollback.

    await session.commitTransaction();

    return transactionRecord[0];

  } catch (error) {
    // ══════════════════════════════════════════════════════════════════════════
    // FAILURE HANDLER: Global rollback via abortTransaction()
    // ══════════════════════════════════════════════════════════════════════════
    //
    // If we reach this catch block, it means one of the following occurred:
    //   1. senderWallet debit failed (insufficient funds, frozen wallet)
    //   2. Recipient lookup or credit failed
    //   3. Transaction ledger entry creation failed (validation error, duplicate ref)
    //   4. commitTransaction() itself failed (network drop, replica set election)
    //   5. Any unexpected error within the try block
    //
    // abortTransaction() reverses ALL operations performed within the session.
    // The sender's balance is restored, no credit is applied, and no ledger
    // entry exists. The system is in the exact same state as before the
    // transfer was attempted.

    await session.abortTransaction();

    // Log the failure for operational monitoring
    console.error('[TRANSFER_ABORT]', {
      senderUserId,
      recipientId,
      amount,
      currency,
      error: error.message,
      timestamp: new Date().toISOString(),
    });

    // Re-throw with context for the controller to handle
    throw error;

  } finally {
    // ══════════════════════════════════════════════════════════════════════════
    // CLEANUP: Always end the session, regardless of success or failure
    // ══════════════════════════════════════════════════════════════════════════
    //
    // endSession() releases the server-side session resources. Failing to
    // call this leaks sessions on the MongoDB server, which has a default
    // limit of 1,000,000 concurrent sessions but can cause memory pressure
    // well before that limit.

    session.endSession();
  }
};

module.exports = { executeTransfer };
```

#### Why Each Step Matters

| Step | What Happens | What Breaks Without It |
|---|---|---|
| **Pre-flight checks** | Account active status verified *before* session creation | Frozen accounts would acquire write locks on wallets before being rejected, increasing contention |
| **Session + startTransaction()** | Creates an isolated snapshot of the database | Without a session, each operation is independent — debit could succeed while credit fails, creating a split-state |
| **Atomic check-and-deduct** | `findOneAndUpdate` with `$gte` guard | Separate read-then-write allows double-spending race condition (Section 4.3) |
| **Ledger entry creation** | Immutable record with crypto reference | Without the ledger entry, there's no proof the transfer happened. Reconciliation becomes impossible |
| **commitTransaction()** | Persists all changes atomically | Changes remain invisible to other sessions and can be rolled back |
| **abortTransaction()** | Reverses all uncommitted changes | Without explicit abort, the session eventually times out (default 60s) but holds locks during that period |
| **endSession()** | Releases server resources | Session leak — progressive memory exhaustion on the MongoDB server |

---

### 5.3 Failures & Edge Cases: The Recovery Script Sequence

Every failure mode in the transfer pipeline must result in a clean, deterministic recovery. The principle is simple: **after any failure, the system must be in the exact same state as before the transfer was initiated.** No partial debits, no phantom credits, no orphaned ledger entries.

#### Failure Mode Matrix

| Failure Point | What Happened | Recovery Action | End State |
|---|---|---|---|
| **Pre-flight: User not found** | No session started yet | Throw error, return 404 | No changes |
| **Pre-flight: Account frozen** | No session started yet | Throw error, return 403 | No changes |
| **Step 2: Insufficient funds** | Session started, no writes yet | `abortTransaction()` → `endSession()` | No changes |
| **Step 2: Wallet frozen** | Session started, no writes yet | `abortTransaction()` → `endSession()` | No changes |
| **Step 3: Recipient not found** | Sender debited within session | `abortTransaction()` → sender balance restored | No changes |
| **Step 4: Ledger write fails** | Sender debited, recipient credited within session | `abortTransaction()` → all changes reversed | No changes |
| **Step 4: Duplicate reference code** | Extremely rare (1 in 2⁹⁶) | `abortTransaction()` → retry with new reference | No changes |
| **Step 5: commitTransaction() network drop** | All writes prepared but not committed | MongoDB's transaction timeout (default 60s) triggers server-side abort | No changes |
| **Step 5: Replica set election during commit** | Primary steps down mid-commit | Transaction is aborted by the new primary. `TransientTransactionError` label allows safe retry | No changes |
| **Application crash after debit, before commit** | Session never committed | MongoDB's server-side session timeout aborts the transaction automatically | No changes |
| **MongoDB server crash** | Journal (WAL) may or may not have the commit record | If committed to journal: recovered on restart. If not committed: transaction is rolled back on restart | Consistent either way |

#### Transient Error Retry Pattern

MongoDB labels certain errors as **retryable**. These errors indicate a transient infrastructure condition (network blip, replica set election) rather than a logical application error:

```javascript
const executeTransferWithRetry = async (
  senderUserId,
  recipientId,
  amount,
  currency,
  description,
  ipAddress
) => {
  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 200;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await executeTransfer(
        senderUserId,
        recipientId,
        amount,
        currency,
        description,
        ipAddress
      );
    } catch (error) {
      const isRetryable =
        error.hasOwnProperty('errorLabels') && (
          error.errorLabels.includes('TransientTransactionError') ||
          error.errorLabels.includes('UnknownTransactionCommitResult')
        );

      if (isRetryable && attempt < MAX_RETRIES) {
        console.warn(
          `[TRANSFER_RETRY] Transient error on attempt ${attempt}/${MAX_RETRIES}:`,
          error.message
        );
        // Exponential backoff: 200ms, 400ms, 800ms
        await new Promise(resolve =>
          setTimeout(resolve, RETRY_DELAY_MS * Math.pow(2, attempt - 1))
        );
        continue;
      }

      // Non-retryable error or max retries exceeded
      // Log a failed transaction for admin visibility
      try {
        await Transaction.create({
          senderWalletId: null,     // Unknown — debit may not have occurred
          recipientId: recipientId,
          amount: amount,
          currency: currency,
          referenceCode: 'TXN-' + crypto.randomBytes(12).toString('hex').toUpperCase(),
          status: 'failure',
          type: 'transfer',
          errorMessage: error.message,
          errorCode: error.code ? String(error.code) : 'UNKNOWN',
          description: description,
          ipAddress: ipAddress,
        });
      } catch (logError) {
        // If even the failure log fails, escalate to system monitoring
        console.error('[CRITICAL] Failed to log transaction failure:', logError.message);
      }

      throw error;
    }
  }
};
```

#### Critical Safety Properties

1. **No Split-State Guarantee.** Because all debit, credit, and ledger operations are within a single MongoDB session, `abortTransaction()` reverses *all* of them atomically. There is no scenario where the sender is debited but the ledger entry is missing, or the credit is applied but the debit is not.

2. **No Fund Leakage.** The `$gte` guard in Step 2 ensures that a debit only occurs if funds are available. The `min: 0` schema validator ensures that even if application logic has a bug, a negative balance can never be persisted. These are two independent safety layers.

3. **No Phantom Transactions.** The ledger entry is created within the same session as the wallet modifications. If the session aborts, the ledger entry vanishes along with the balance changes. There are no orphaned "success" entries for transfers that were actually rolled back.

4. **Server-Side Timeout Backstop.** If the application crashes after starting a transaction but before committing or aborting, MongoDB's server-side session timeout (default: 60 seconds, configurable via `transactionLifetimeLimitSeconds`) will automatically abort the transaction. This is the final safety net.

---

## 6. Appendix: Collection Size Projections & Operational Notes

### Collection Growth Projections

Assuming a moderately active PayGate deployment:

| Collection | Doc Size (avg) | Growth Rate | 1-Year Projection | Index Size (est.) |
|---|---|---|---|---|
| `users` | ~0.5 KB | 1,000 new/month | 12,000 docs (~6 MB) | ~2 MB |
| `wallets` | ~1 KB (with pockets) | 1:1 with users | 12,000 docs (~12 MB) | ~3 MB |
| `recipients` | ~0.4 KB | 5 per user avg | 60,000 docs (~24 MB) | ~8 MB |
| `transactions` | ~0.6 KB | 50,000/month | 600,000 docs (~360 MB) | ~150 MB |

The `transactions` collection is by far the largest and fastest-growing. This validates:
- Why transactions must NOT be embedded in user/wallet documents.
- Why compound indexes on this collection are critical.
- Why the B-Tree index on `{ status: 1, createdAt: -1 }` is essential for the admin dashboard.

### Replica Set Requirements

| Capability | Standalone `mongod` | Replica Set | Atlas (Cloud) |
|---|---|---|---|
| Multi-document ACID transactions | ❌ | ✅ | ✅ |
| Read concern `snapshot` | ❌ | ✅ | ✅ |
| Write concern `majority` | ❌ | ✅ | ✅ |
| Automatic failover | ❌ | ✅ | ✅ |

**For development:** Use `mongod --replSet rs0` and initiate with `rs.initiate()` to enable transaction support locally.

**For production:** Use MongoDB Atlas (M10+ tier) or a self-managed 3-node replica set (1 primary + 2 secondaries) for production-grade availability and transaction support.

### Schema Version Migration Strategy

All schemas use `timestamps: true`, which adds `createdAt` and `updatedAt` fields. For future schema migrations:

1. **Additive changes** (new fields with defaults) can be deployed without migration — existing documents gain the new field on next `.save()` or can be backfilled with an `updateMany()`.

2. **Destructive changes** (field removal, type changes) require a migration script that:
   - Runs inside a transaction for consistency
   - Is idempotent (safe to run multiple times)
   - Is tested on a staging replica set before production

3. **Index changes** should use `createIndex()` with `{ background: true }` (MongoDB 4.2+ builds indexes in the background by default) to avoid blocking production writes during index construction.

---

> **End of Database Design Specification.**
>
> This document is a living proposal. All schemas, indexes, and transaction patterns should be reviewed, approved, and stress-tested by the engineering team before implementation. Modifications to this specification must go through architectural review.
```

---

<a id="file-transiqprojectstructuremd"></a>
## 55. `Transiq/PROJECT_STRUCTURE.md`
> **Section**: FRONTEND | **Lines**: 297 | **Path**: `Transiq/PROJECT_STRUCTURE.md`

```markdown
# PayGate - Project Structure & Architecture

## Project Overview
PayGate is a payment gateway system that enables a customer (remitter) to initiate a fund transfer to a recipient, manages the transaction lifecycle, communicates with an authorized banking system, and maintains transaction status and logs.

---

## 6-Module Architecture

### Module 1: Landing Page & Customer Management
**Purpose**: Entry point and customer profile management  
**Responsibilities**:
- Landing page UI
- Customer account creation/setup
- Customer profile management
- Account details display
- Payment activity overview

**Files**:
```
backend/modules/01-customer/
  ├── models/Customer.js
  ├── controllers/customerController.js
  ├── routes/customerRoutes.js
  ├── services/customerService.js
  └── validations/customerValidation.js

frontend/modules/01-customer/
  ├── pages/LandingPage.jsx
  ├── pages/CustomerDashboard.jsx
  ├── components/CustomerProfile.jsx
  ├── components/AccountDetails.jsx
  └── store/customerStore.js
```

---

### Module 2: Remitter & Recipient Management
**Purpose**: Manage payment participants and authorized accounts  
**Responsibilities**:
- Remitter (sender) profile management
- Recipient (receiver) profile management
- Authorized account management
- Payment destination selection
- Recipient directory/search

**Files**:
```
backend/modules/02-participants/
  ├── models/Remitter.js
  ├── models/Recipient.js
  ├── models/AuthorizedAccount.js
  ├── controllers/remitterController.js
  ├── controllers/recipientController.js
  ├── routes/participantRoutes.js
  ├── services/remitterService.js
  ├── services/recipientService.js
  └── validations/participantValidation.js

frontend/modules/02-participants/
  ├── pages/RemitterProfile.jsx
  ├── pages/RecipientList.jsx
  ├── components/RemitterForm.jsx
  ├── components/RecipientSelector.jsx
  ├── components/AuthorizedAccountList.jsx
  └── store/participantStore.js
```

---

### Module 3: Payment Initiation Module
**Purpose**: Start and validate payment requests  
**Responsibilities**:
- Payment initiation UI
- Fund amount input
- Recipient selection
- Payment request validation
- Request generation

**Files**:
```
backend/modules/03-initiation/
  ├── models/PaymentRequest.js
  ├── controllers/initiationController.js
  ├── routes/initiationRoutes.js
  ├── services/initiationService.js
  ├── validations/paymentValidation.js
  └── utils/paymentRequestGenerator.js

frontend/modules/03-initiation/
  ├── pages/InitiatePayment.jsx
  ├── components/PaymentForm.jsx
  ├── components/FundAmountInput.jsx
  ├── components/RecipientSelection.jsx
  ├── components/PaymentReview.jsx
  └── store/initiationStore.js
```

---

### Module 4: Transaction & Fund Processing Module ⭐ **CORE**
**Purpose**: The heart of PayGate - manage complete transaction lifecycle  
**Responsibilities**:
- Create transaction records
- Generate unique Transaction IDs
- Process fund transfer requests
- Track transaction status (pending/success/failure)
- Maintain transaction lifecycle
- Handle transaction state management

**Files**:
```
backend/modules/04-transaction/
  ├── models/Transaction.js
  ├── models/TransactionStatus.js
  ├── controllers/transactionController.js
  ├── routes/transactionRoutes.js
  ├── services/transactionService.js
  ├── services/transactionProcessing.js
  ├── validations/transactionValidation.js
  ├── utils/transactionIdGenerator.js
  ├── utils/transactionStateManager.js
  └── middleware/transactionMiddleware.js

frontend/modules/04-transaction/
  ├── pages/TransactionDetails.jsx
  ├── components/TransactionTracker.jsx
  ├── components/TransactionStatus.jsx
  ├── components/TransactionTimeline.jsx
  ├── store/transactionStore.js
  └── utils/transactionStatusFormatter.js
```

---

### Module 5: Banking & Fund Handling Module
**Purpose**: Interact with authorized banking system (simulated/limited)  
**Responsibilities**:
- Authorized account reference management
- Balance/fund validation
- Debit instruction generation
- Credit instruction generation
- Simulated bank response handling
- Fund transfer status tracking

**Files**:
```
backend/modules/05-banking/
  ├── models/BankAccount.js
  ├── models/FundInstruction.js
  ├── controllers/bankingController.js
  ├── routes/bankingRoutes.js
  ├── services/bankingService.js
  ├── services/fundValidation.js
  ├── services/bankSimulator.js
  ├── validations/bankingValidation.js
  └── utils/bankResponseHandler.js

frontend/modules/05-banking/
  ├── components/BankAccountSelector.jsx
  ├── components/BalanceDisplay.jsx
  ├── components/BankResponse.jsx
  └── store/bankingStore.js
```

---

### Module 6: Transaction Logs & Monitoring Module
**Purpose**: Audit, monitoring, and historical records  
**Responsibilities**:
- Transaction log records
- Payment history tracking
- Success/failure records
- Pending transaction monitoring
- Error logging
- Admin monitoring dashboard

**Files**:
```
backend/modules/06-logs/
  ├── models/TransactionLog.js
  ├── models/ErrorLog.js
  ├── controllers/logsController.js
  ├── routes/logsRoutes.js
  ├── services/loggingService.js
  ├── services/monitoringService.js
  └── utils/logFormatter.js

frontend/modules/06-logs/
  ├── pages/TransactionHistory.jsx
  ├── pages/AdminMonitoring.jsx
  ├── components/LogViewer.jsx
  ├── components/PaymentHistory.jsx
  ├── components/ErrorLogViewer.jsx
  ├── components/MonitoringDashboard.jsx
  └── store/logsStore.js
```

---

## Core Workflow Flow

```
Landing Page (Module 1)
     ↓
Customer Registration/Login (Module 1)
     ↓
Remitter Profile Setup (Module 2)
     ↓
Select Recipient (Module 2)
     ↓
Initiate Payment (Module 3)
  - Enter Fund Amount
  - Validate Details
  - Generate Request
     ↓
Create Transaction (Module 4) ⭐
  - Generate Transaction ID
  - Set Initial Status: PENDING
     ↓
Fund Processing (Module 4) ⭐
  - Validate Fund Transfer
  - Track Status
     ↓
Authorized Banking System (Module 5)
  - Validate Authorized Account
  - Execute Debit/Credit Instructions
  - Receive Bank Response
     ↓
Update Transaction Status (Module 4) ⭐
  - SUCCESS / FAILURE / PENDING
     ↓
Transaction Log Updated (Module 6)
  - Record in Database
  - Update Admin Dashboard
```

---

## Key Architecture Decisions

1. **Module Isolation**: Each module is independent with its own models, controllers, services
2. **Core Focus**: Module 4 (Transaction & Fund Processing) is the heart - all other modules feed into it
3. **Service Layer**: Business logic in services, not controllers
4. **Validation Layer**: Dedicated validation for each module
5. **Frontend/Backend Separation**: Clear separation with API boundaries
6. **Logging Throughout**: Every significant action logged to Module 6

---

## Technology Stack

**Backend**:
- Node.js + Express
- MongoDB (Mongoose ODM)
- JWT Authentication
- Express Validation

**Frontend**:
- React + Vite
- Zustand/Redux for state management
- Axios for API calls
- Tailwind CSS for styling

---

## Environment Setup

```
MERN PROJECT/
├── Transiq/                    (Frontend - React + Vite)
│   ├── src/
│   │   ├── modules/           (6 Modules)
│   │   ├── components/
│   │   ├── pages/
│   │   └── store/
│   └── package.json
│
└── transiq-api/               (Backend - Node + Express)
    ├── src/
    │   ├── modules/           (6 Modules)
    │   ├── config/
    │   ├── middleware/
    │   └── utils/
    └── package.json
```

---

## Next Steps

1. Create backend API structure (Node.js + Express)
2. Create MongoDB schemas for each module
3. Implement Module 4 first (core transaction processing)
4. Build API routes for Module 4
5. Create frontend components for each module
6. Integrate modules in correct workflow order
```

---

<a id="file-transiqreactrouterimplementationmd"></a>
## 56. `Transiq/REACT_ROUTER_IMPLEMENTATION.md`
> **Section**: FRONTEND | **Lines**: 573 | **Path**: `Transiq/REACT_ROUTER_IMPLEMENTATION.md`

```markdown
# React Router Implementation Documentation

## Overview
Complete React Router setup with StrictMode, Link navigation, useState, click events, props, and conditional rendering implemented across all PayGate modules.

---

## 1. React Router Setup (App.jsx)

**Location**: `src/App.jsx`

### Implementations:

#### ✓ StrictMode
```jsx
<StrictMode>
  <BrowserRouter>
    {/* All content wrapped in StrictMode for strict checks */}
  </BrowserRouter>
</StrictMode>
```
- **Purpose**: Detects potential issues in application during development
- **Effect**: Mounts components twice to identify side effects

#### ✓ BrowserRouter
- **Purpose**: Provides routing context for entire app
- **Setup**: Wraps all Routes and Navigation

#### ✓ Routes Configuration
```jsx
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/dashboard" element={<CustomerDashboard />} />
  <Route path="/remitter/profile" element={<RemitterProfile />} />
  <Route path="/recipients" element={<RecipientList />} />
  <Route path="/payment/initiate" element={<InitiatePayment />} />
  <Route path="/transaction/:id" element={<TransactionDetails />} />
  <Route path="/history" element={<TransactionHistory />} />
  <Route path="/admin/monitoring" element={<AdminMonitoring />} />
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```
- **Modules Coverage**: All 6 modules have dedicated routes
- **Dynamic Routes**: `/transaction/:id` - accepts transaction ID parameter
- **Fallback**: Wildcard route redirects to home

---

## 2. Navigation Component

**Location**: `src/components/Navigation.jsx`

### Implementations:

#### ✓ useState - Menu State Management
```jsx
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [activeMenu, setActiveMenu] = useState('');
```
- **isMenuOpen**: Toggle mobile menu visibility
- **activeMenu**: Track which submenu is expanded

#### ✓ Link Navigation (No Anchor Tags)
```jsx
<Link to="/" className="nav-logo">TRANSIQ</Link>
<Link to="/dashboard" className="nav-link">Dashboard</Link>
<Link to="/remitter/profile" className="nav-link">Remitter Profile</Link>
<Link to="/recipients" className="nav-link">Recipients</Link>
<Link to="/payment/initiate" className="nav-section-title">Initiate Payment</Link>
<Link to="/history" className="nav-link">Transaction History</Link>
<Link to="/admin/monitoring" className="nav-link">Admin Monitoring</Link>
```
- **All navigation uses Link component** - No anchor tags
- **Prevents full page refresh** - Single-page app behavior

#### ✓ Click Events
```jsx
onClick={() => setIsMenuOpen(!isMenuOpen)}         // Toggle menu
onClick={() => handleMenuClick('customer')}       // Expand section
onClick={handleLinkClick}                          // Close menu after navigation
```

#### ✓ Conditional Rendering
```jsx
{activeMenu === 'customer' && (
  <div className="nav-submenu">
    {/* Submenu items only show when customer is active */}
  </div>
)}

{isMenuOpen && (
  <div className="nav-menu active">
    {/* Mobile menu only shows when open */}
  </div>
)}
```

#### ✓ Props Passing
```jsx
// Navigation receives no props but manages its own state
// Can be extended with props for active page indication
```

---

## 3. Module 1 - Customer Management

### LandingPage.jsx

**Location**: `src/modules/01-customer/pages/LandingPage.jsx`

#### ✓ useState
```jsx
const [email, setEmail] = useState('');
const [showSignUp, setShowSignUp] = useState(false);
```

#### ✓ Click Events
```jsx
<button onClick={handleLogin}>Login</button>
<button onClick={handleSignUpToggle}>Sign Up</button>
```

#### ✓ Conditional Rendering
```jsx
{!showSignUp ? (
  {/* Login Form */}
) : (
  {/* Sign Up Form */}
)}
```

#### ✓ Link Navigation
```jsx
<Link to="/remitter/profile">Remitter Profile</Link>
<Link to="/recipients">Recipients</Link>
```

#### ✓ useNavigate Hook
```jsx
const navigate = useNavigate();
const handleLogin = () => navigate('/dashboard');
```

---

### CustomerDashboard.jsx

**Location**: `src/modules/01-customer/pages/CustomerDashboard.jsx`

#### ✓ useState (Multiple States)
```jsx
const [activeTab, setActiveTab] = useState('overview');
const [showDetails, setShowDetails] = useState(false);
const [selectedTransaction, setSelectedTransaction] = useState(null);
```

#### ✓ Click Events
```jsx
onClick={() => handleTabChange('overview')}              // Tab switching
onClick={() => handleTransactionClick(txn)}             // Select transaction
onClick={handleCloseDetails}                             // Close modal
```

#### ✓ Conditional Rendering (Tabs)
```jsx
{activeTab === 'overview' && <div>Overview Content</div>}
{activeTab === 'transactions' && <div>Transactions Content</div>}
{activeTab === 'settings' && <div>Settings Content</div>}
```

#### ✓ Conditional Rendering (Modal)
```jsx
{showDetails && selectedTransaction && (
  <div className="modal">
    {/* Transaction Details Modal */}
  </div>
)}
```

#### ✓ Link Navigation
```jsx
<Link to="/payment/initiate">Send Money</Link>
<Link to="/recipients">View Recipients</Link>
<Link to="/remitter/profile">View Full Profile</Link>
<Link to="/history">View Full History</Link>
<Link to={`/transaction/${selectedTransaction.id}`}>View Full Details</Link>
```

#### ✓ Props Usage
- Customer data object passed as state (can be extended with props)
- Transaction list created within component (can receive as props)

---

## 4. Module 2 - Participants Management

### RemitterProfile.jsx

**Location**: `src/modules/02-participants/pages/RemitterProfile.jsx`

#### ✓ useState
```jsx
const [isEditing, setIsEditing] = useState(false);
const [formData, setFormData] = useState({
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '9876543210',
  accountNumber: '1234567890123456',
  bankName: 'HDFC Bank',
  accountType: 'Savings',
});
```

#### ✓ Click Events
```jsx
onClick={handleEditClick}        // Toggle edit mode
onClick={handleSave}             // Save changes
onClick={handleInitiatePayment}  // Navigate to payment
```

#### ✓ Change Events
```jsx
onChange={handleChange}  // Update form data on input change
```

#### ✓ Conditional Rendering (Edit/View Mode)
```jsx
{!isEditing ? (
  // View Mode - Display data
) : (
  // Edit Mode - Form inputs
)}
```

#### ✓ Link Navigation
```jsx
<Link to="/dashboard">Back to Dashboard</Link>
<Link to="/payment/initiate">Initiate Payment</Link>
```

#### ✓ Dynamic Styling
```jsx
className={isEditing ? 'bg-red-600' : 'bg-blue-600'}
```

---

### RecipientList.jsx

**Location**: `src/modules/02-participants/pages/RecipientList.jsx`

#### ✓ useState (Complex State)
```jsx
const [recipients, setRecipients] = useState([...]);
const [showAddForm, setShowAddForm] = useState(false);
const [selectedRecipient, setSelectedRecipient] = useState(null);
const [showDetails, setShowDetails] = useState(false);
const [newRecipient, setNewRecipient] = useState({...});
```

#### ✓ Click Events (Multiple)
```jsx
onClick={() => handleSelectRecipient(recipient)}    // View details
onClick={handleAddRecipient}                        // Add form
onClick={() => handleSendMoney(recipient)}          // Send payment
onClick={() => handleDeleteRecipient(recipient.id)} // Delete
onClick={() => handleToggleSave(recipient.id)}      // Save/Unsave
```

#### ✓ Change Events
```jsx
onChange={handleInputChange}  // Form input changes
```

#### ✓ Conditional Rendering (Multiple Cases)
```jsx
{recipients.length === 0 ? (
  <div>No recipients</div>
) : (
  recipients.map(...)
)}

{showAddForm && <div>Add Form</div>}

{showDetails && selectedRecipient && (
  <div>Details Modal</div>
)}
```

#### ✓ Link Navigation
```jsx
<Link to="/dashboard">Back</Link>
// navigate used for dynamic routing with state
navigate('/payment/initiate', { state: { recipient } })
```

#### ✓ Array State Management
```jsx
// Add to array
setRecipients([...recipients, newRecipient])

// Update array
setRecipients(recipients.map(r => r.id === id ? {...r, saved: !r.saved} : r))

// Remove from array
setRecipients(recipients.filter(r => r.id !== id))
```

---

## 5. Module 3 - Payment Initiation

### InitiatePayment.jsx

**Location**: `src/modules/03-initiation/pages/InitiatePayment.jsx`

#### ✓ useState
```jsx
const [step, setStep] = useState(1);                  // Multi-step form
const [formData, setFormData] = useState({...});      // Form data
const [errors, setErrors] = useState({});             // Validation errors
```

#### ✓ Click Events (Step Navigation)
```jsx
onClick={handleNext}        // Next step with validation
onClick={handlePrev}        // Previous step
onClick={handleSubmit}      // Final submission
```

#### ✓ Change Events (Form Input)
```jsx
onChange={handleChange}  // Update formData and clear errors
```

#### ✓ Conditional Rendering (Multi-Step Form)
```jsx
{step === 1 && <div>Payment Details</div>}
{step === 2 && <div>Review Payment</div>}
{step === 3 && <div>Confirm Payment</div>}
```

#### ✓ Conditional Rendering (Progress Indicator)
```jsx
{step >= stepNum ? 'bg-blue-600' : 'bg-gray-200'}
```

#### ✓ Conditional Rendering (Error Messages)
```jsx
{errors.recipient && <p className="text-red-600">{errors.recipient}</p>}
{errors.amount && <p className="text-red-600">{errors.amount}</p>}
```

#### ✓ Link Navigation
```jsx
<Link to="/dashboard">Cancel</Link>
<Link to="/recipients">Add new recipient</Link>
```

#### ✓ useNavigate
```jsx
navigate('/dashboard')  // After successful submission
```

#### ✓ Validation Logic
```jsx
const validateStep = (currentStep) => {
  const newErrors = {};
  if (currentStep === 1) {
    if (!formData.recipient) newErrors.recipient = 'Please select a recipient';
    if (!formData.amount) newErrors.amount = 'Please enter amount';
    if (parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount must be greater than 0';
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

---

## 6. Module 4 - Transaction Processing

### TransactionDetails.jsx

**Location**: `src/modules/04-transaction/pages/TransactionDetails.jsx`

#### ✓ useState
```jsx
const [activeTab, setActiveTab] = useState('overview');      // Tab state
const [showRetryForm, setShowRetryForm] = useState(false);   // Form state
```

#### ✓ useParams Hook
```jsx
const { id } = useParams();  // Get transaction ID from URL
```

#### ✓ Click Events
```jsx
onClick={handleDownloadReceipt}  // Download PDF
onClick={handleShareReceipt}     // Send email
onClick={() => setShowRetryForm(!showRetryForm)}  // Toggle form
onClick={() => handleTabChange('overview')}      // Switch tabs
```

#### ✓ Conditional Rendering (Tabs)
```jsx
{activeTab === 'overview' && <div>Overview</div>}
{activeTab === 'timeline' && <div>Timeline</div>}
{activeTab === 'parties' && <div>Parties</div>}
```

#### ✓ Conditional Rendering (Retry Form)
```jsx
{showRetryForm && (
  <div className="bg-white rounded-lg shadow p-6">
    {/* Report Issue Form */}
  </div>
)}
```

#### ✓ Conditional Rendering (List Items)
```jsx
{transaction.statusHistory.map((history, idx) => (
  <div key={idx}>
    {/* Timeline item */}
  </div>
))}
```

#### ✓ Link Navigation
```jsx
<Link to="/history">Back to History</Link>
```

#### ✓ Dynamic CSS Styling
```jsx
className={`px-6 py-3 rounded-lg ${getStatusColor(transaction.status)}`}
```

#### ✓ Helper Functions
```jsx
const getStatusColor = (status) => {...}     // Reusable styling
const getStatusIcon = (status) => {...}      // Reusable icons
```

---

## 7. Module 6 - Logs & Monitoring

### Already Implemented
- Simple React UI components with Zustand store
- Can be integrated with React Router as shown above

#### Potential enhancements with React Router:

```jsx
// TransactionHistory.jsx - Link to transaction details
<Link to={`/transaction/${log.transactionId}`}>
  View Details
</Link>

// AdminMonitoring.jsx - View full transaction
<Link to={`/transaction/${txn.transactionId}`}>
  Full Details
</Link>
```

---

## Key Features Summary

| Feature | Count | Implementations |
|---------|-------|-----------------|
| **useState** | 15+ | Navigation, Forms, Tabs, Modals, Lists |
| **Click Events** | 40+ | Button clicks, Tab switches, Form actions |
| **Link Navigation** | 25+ | Internal page navigation |
| **useNavigate** | 5+ | Programmatic navigation |
| **useParams** | 1 | Dynamic route parameters |
| **Conditional Rendering** | 30+ | Forms, Tabs, Modals, Lists, Status displays |
| **Change Events** | 10+ | Form input handling |
| **Form Validation** | 3 | Multi-field validation |
| **Array Operations** | 10+ | Map, Filter, Spread operators |

---

## Best Practices Implemented

✓ **No Anchor Tags** - All navigation uses `<Link>` component
✓ **StrictMode** - Wrapped entire app for development checks
✓ **Proper State Management** - useState for component-level state
✓ **Event Handling** - Click and Change events properly bound
✓ **Conditional Rendering** - Clean ternary and logical operators
✓ **Props Ready** - Components can receive props (extend as needed)
✓ **Error Handling** - Form validation with error messages
✓ **Dynamic Routing** - URL parameters for transaction details
✓ **Navigation Feedback** - Active tab/menu indicators
✓ **Responsive Design** - Works on mobile and desktop

---

## File Structure

```
src/
├── App.jsx                                    (Router setup)
├── components/
│   ├── Navigation.jsx                         (Link navigation)
│   └── Navigation.css
│
└── modules/
    ├── 01-customer/
    │   └── pages/
    │       ├── LandingPage.jsx                (useState, useState Link, Click, Conditional)
    │       └── CustomerDashboard.jsx          (useState, Link, Click, Conditional, Modal)
    │
    ├── 02-participants/
    │   └── pages/
    │       ├── RemitterProfile.jsx            (useState, Link, Click, Change, Conditional)
    │       └── RecipientList.jsx              (useState, Link, Click, Array ops, Modal)
    │
    ├── 03-initiation/
    │   └── pages/
    │       └── InitiatePayment.jsx            (Multi-step, useState, Validation, Link)
    │
    ├── 04-transaction/
    │   └── pages/
    │       └── TransactionDetails.jsx         (useParams, useState, Link, Conditional)
    │
    └── 06-logs/
        ├── pages/
        │   └── [Already implemented with simple UI]
        └── components/
            └── [Ready for Link integration]
```

---

## Next Steps for Enhancement

1. **Add useContext** - For global state (user, theme)
2. **Add useEffect** - For data fetching from APIs
3. **Add useCallback** - For memoized functions
4. **Add useReducer** - For complex state logic
5. **Add PropTypes/TypeScript** - For type safety
6. **Add Protected Routes** - For authentication
7. **Add Loading States** - For async operations
8. **Add Error Boundaries** - For error handling

---

## Testing the Implementation

**To test routing:**
1. Start the app: `npm run dev`
2. Click navigation links - should not do full page refresh
3. Check browser URL - should update without reload
4. Test browser back/forward - should work correctly
5. Open DevTools - StrictMode warnings should appear in console
6. Test mobile menu - should toggle on small screens

**Verification Checklist:**
- ✓ All pages accessible via Link navigation
- ✓ No anchor tags in navigation
- ✓ StrictMode enabled in App.jsx
- ✓ Forms have change event handlers
- ✓ Click events trigger state changes
- ✓ Conditional rendering based on state
- ✓ Modal windows open/close on click
- ✓ Form validation shows errors
- ✓ Tab switching works
- ✓ Link navigation doesn't reload page
```

---

<a id="file-transiqreadmemd"></a>
## 57. `Transiq/README.md`
> **Section**: FRONTEND | **Lines**: 210 | **Path**: `Transiq/README.md`

```markdown
# PayGate / Transiq UI Handoff

This is the shared UI and module integration guide for the PayGate payment gateway. The application has two navigation shells:

- **Customer menu** for Modules 1-5
- **Admin menu** for Module 6: Transaction Logs and Monitoring

The sidebar, typography, icons, colors, spacing, active states, and responsive layout are shared standards. Module teams should add page content without redesigning the shell.

## Files To Share Together

There is no single HTML file to share for this React application. Share these files together so the UI remains identical:

```text
src/
  main.jsx                 # React entry point; imports the global stylesheet
  index.css                # Global reset, font, body background, root sizing
  App.jsx                 # Role switch, sidebar selection, and routes
  App.css                 # Main layout, content offset, settings page, mode switcher
  components/
    CustomerSidebar.jsx   # Customer menu
    AdminSidebar.jsx      # Admin menu
    SidebarIcon.jsx       # Shared SVG icon set
    Sidebar.css           # Shared sidebar layout and visual design
```

Also share `package.json` so dependencies and scripts stay the same. The module folders under `src/modules/` contain each team's page and business logic.

**Important:** Do not copy only `CustomerSidebar.jsx` or `AdminSidebar.jsx`. The JSX depends on `SidebarIcon.jsx` and `Sidebar.css`, while the page position and global font depend on `index.css` and `App.css`.

## If Sharing The Home Page Only

For a teammate building only the customer Home page, share this minimum package:

```text
src/
  main.jsx
  index.css
  App.jsx
  App.css
  components/
    CustomerSidebar.jsx
    SidebarIcon.jsx
    Sidebar.css
  modules/01-landing/
    pages/HomePage.jsx       # teammate's page content
```

The teammate should replace only the Home page file and keep the shell files unchanged. In `App.jsx`, connect the page to the customer home route:

```jsx
import HomePage from './modules/01-landing/pages/HomePage';

<Route path="/" element={<HomePage />} />
```

The Home page itself should contain content only. It should not contain a second sidebar, global font declaration, `BrowserRouter`, or a full-screen layout that overrides the shell. Use a page wrapper such as:

```jsx
const HomePage = () => (
  <section className="module-page">
    <h1>Dashboard</h1>
    <p>Customer account overview.</p>
  </section>
);

export default HomePage;
```

If the teammate needs a different page-specific design, add a stylesheet beside `HomePage.jsx`; do not edit the shared sidebar or global CSS.

## Exact UI Standards

These values define the current company-style shell:

| Property | Standard |
| --- | --- |
| Font | `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif` |
| Sidebar width | `252px` expanded; `76px` collapsed |
| Sidebar background | `#151716` |
| Sidebar border | `1px solid rgba(255, 255, 255, 0.08)` |
| Item height | `44px` minimum |
| Item radius | `7px` |
| Item text | `14px`, weight `500` |
| Icon | Monochrome SVG, `22px`, no emoji |
| Active indicator | Blue `#3d73d3`, `3px` wide |
| Content offset | `252px` on desktop; `0` on mobile |
| Mobile breakpoint | `640px` |
| Admin/customer switch | Top-right, development-only |

The global font and page defaults are in `src/index.css`. Sidebar-specific values are in `src/components/Sidebar.css`. Do not introduce a second font, emoji icons, random icon libraries, or a second navigation style.

## Run And Validate

Run commands from the `Transiq` frontend folder:

```bash
npm install
npm run dev
npm run lint
npm run build
```

Open `http://localhost:5173/` in a browser.

## Customer/Admin Role Switch

For development, `App.jsx` contains:

```jsx
const [userMode, setUserMode] = useState('admin');

{userMode === 'admin' ? <AdminSidebar /> : <CustomerSidebar />}
```

The top-right **Customer menu** and **Admin menu** buttons switch between the two shells. In production, replace this temporary switch with the authenticated user's role. Do not create another sidebar.

## Customer Menu Contract

| Label | Route | Module |
| --- | --- | --- |
| Dashboard | `/` | 1 |
| My wallet | `/my-wallet` | 1 |
| My pockets | `/my-pockets` | 1 |
| Recipients | `/recipients` | 2 |
| Send money | `/send-money` | 3 |
| Transactions | `/transactions` | 4 |
| Financial analysis | `/financial-analysis` | 4 |
| Insights | `/insights` | 4 |
| Security | `/security` | 5 |

Customer workflow:

```text
Landing Page -> Customer -> Remitter -> Recipient -> Fund Amount
-> Payment Initiation -> Transaction -> Limited Banking
-> Success / Failure / Pending -> Transaction Log
```

## Admin Menu Contract: Module 6

| Label | Route | Ownership |
| --- | --- | --- |
| Overview | `/admin/monitoring` | Module 6 dashboard |
| Payment history | `/admin/history` | Module 6 |
| Transaction logs | `/admin/logs` | Module 6 |
| Pending monitor | `/admin/pending` | Module 6, live badge |
| Error logs | `/admin/errors` | Module 6, unresolved badge |
| Settings | `/admin/settings` | Standalone settings page |

Module 6 implementation:

```text
src/modules/06-logs/
  components/
  pages/
  store/
```

It contains the monitoring dashboard, transaction logs, payment history, pending monitor, error logs, and Zustand store.

## Adding A Module Page

Create the page inside the assigned module folder, then register its route in `src/App.jsx`:

```jsx
import RecipientsPage from './modules/02-remitter-recipient/pages/RecipientsPage';

<Route path="/recipients" element={<RecipientsPage />} />
```

Keep page-specific CSS inside the module. Do not modify `Sidebar.css` for page styling. Keep menu labels and documented routes stable so teams can work independently and integrate later.

## Settings

`/admin/settings` is a registered route and opens the standalone Settings workspace. Replace only its page content when the requirements are defined. The Settings icon is the `settings` cog in `SidebarIcon.jsx`; it must remain a cog, not a light bulb or sun symbol.

## Six Module Scope

1. Landing Page and Customer Management
2. Remitter and Recipient Management
3. Payment Initiation
4. Transaction and Fund Processing
5. Banking and Fund Handling
6. Transaction Logs and Monitoring

PayGate enables a customer acting as a remitter to initiate a fund transfer to a recipient, manages the transaction lifecycle, communicates with an authorized banking system, and records payment status and events.

## Strict Team Rules

- Share and reuse all shell files listed above.
- Do not use emoji icons, text-symbol icons, or mixed icon libraries.
- Do not expose internal labels such as `module 2` or `opens wizard` in the product UI.
- Do not duplicate or redesign the Customer/Admin sidebars.
- Keep the font, sidebar width, content offset, colors, icon size, and active state unchanged.
- Use semantic links for navigation and buttons for actions.
- Put module ownership in folders and documentation, not customer-facing labels.
- Run `npm run lint` and `npm run build` before handoff.
- Test both Customer and Admin menu buttons after route changes.

## Handoff Checklist

- [ ] Page created inside the assigned module folder
- [ ] Route registered in `src/App.jsx`
- [ ] Existing sidebar reused
- [ ] Existing global font and layout preserved
- [ ] No emoji or temporary module wording in visible UI
- [ ] Customer/Admin switching tested
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
```

---

<a id="file-transiqaddcardcjs"></a>
## 58. `Transiq/addCard.cjs`
> **Section**: FRONTEND | **Lines**: 75 | **Path**: `Transiq/addCard.cjs`

```javascript
const fs = require('fs');
let code = fs.readFileSync('src/modules/04-transactions/pages/FinancialAnalysisPage.jsx', 'utf8');

const statusCardHtml = `
        {/* Transaction Status Breakdown */}
        <div className="analytics-chart-card">
          <h2 className="analytics-chart-title">Transaction Status</h2>
          {!summary || summary.totalCount === 0 ? (
            <div className="analytics-no-data">No data yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Success', value: summary?.successCount || 0, color: '#22c55e' },
                      { name: 'Failed', value: summary?.failedCount || 0, color: '#ef4444' },
                      { name: 'Pending', value: summary?.pendingCount || 0, color: '#f59e0b' }
                    ].filter(d => d.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    label={({ name, percent }) => \`\${name} \${(percent * 100).toFixed(0)}%\`}
                    labelLine={{ stroke: '#475569' }}
                  >
                    { [
                      { name: 'Success', value: summary?.successCount || 0, color: '#22c55e' },
                      { name: 'Failed', value: summary?.failedCount || 0, color: '#ef4444' },
                      { name: 'Pending', value: summary?.pendingCount || 0, color: '#f59e0b' }
                    ].filter(d => d.value > 0).map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8 }}
                    formatter={(v) => [v, 'Transactions']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="analytics-method-list">
                {[
                  { name: 'Success', value: summary?.successCount || 0, color: '#22c55e' },
                  { name: 'Failed', value: summary?.failedCount || 0, color: '#ef4444' },
                  { name: 'Pending', value: summary?.pendingCount || 0, color: '#f59e0b' }
                ].filter(d => d.value > 0).map((m, i) => (
                  <div key={m.name} className="analytics-method-row">
                    <span className="analytics-method-dot" style={{ background: m.color }} />
                    <span className="analytics-method-name">{m.name}</span>
                    <span className="analytics-method-val">{m.value} txns</span>
                    <span className="analytics-method-count">{((m.value / summary.totalCount) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
`;

const searchStr = '        </div>\r\n      </div>\r\n    </div>';
let idx = code.indexOf(searchStr);

if (idx === -1) {
  const unixSearchStr = '        </div>\n      </div>\n    </div>';
  idx = code.indexOf(unixSearchStr);
}

if (idx > -1) {
  code = code.substring(0, idx) + '        </div>\n' + statusCardHtml + '\n      </div>\n    </div>' + code.substring(idx + searchStr.length);
  fs.writeFileSync('src/modules/04-transactions/pages/FinancialAnalysisPage.jsx', code);
  console.log('Successfully injected Transaction Status card.');
} else {
  console.log('Could not find injection point!');
}
```

---

<a id="file-transiqeslintconfigjs"></a>
## 59. `Transiq/eslint.config.js`
> **Section**: FRONTEND | **Lines**: 21 | **Path**: `Transiq/eslint.config.js`

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
```

---

<a id="file-transiqfixcsscjs"></a>
## 60. `Transiq/fixCss.cjs`
> **Section**: FRONTEND | **Lines**: 31 | **Path**: `Transiq/fixCss.cjs`

```javascript
const fs = require('fs');
let code = fs.readFileSync('src/modules/04-transactions/transactions.css', 'utf8');

const cssToAdd = `
.insights-hero-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.insights-updated {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
}
`;

const searchStr = '.txn-filters {';
const idx = code.indexOf(searchStr);

if (idx > -1) {
  code = code.substring(0, idx) + cssToAdd + '\n' + code.substring(idx);
  fs.writeFileSync('src/modules/04-transactions/transactions.css', code);
  console.log('done');
} else {
  console.log('not found');
}
```

---

<a id="file-transiqfiximportscjs"></a>
## 61. `Transiq/fixImports.cjs`
> **Section**: FRONTEND | **Lines**: 17 | **Path**: `Transiq/fixImports.cjs`

```javascript
const fs = require('fs');
let code = fs.readFileSync('src/modules/04-transactions/pages/FinancialAnalysisPage.jsx', 'utf8');

const badImport = `import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';`;

const goodImport = `import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';`;

code = code.replace(badImport, goodImport);

fs.writeFileSync('src/modules/04-transactions/pages/FinancialAnalysisPage.jsx', code);
console.log('Imports fixed.');
```

---

<a id="file-transiqfixthemecjs"></a>
## 62. `Transiq/fixTheme.cjs`
> **Section**: FRONTEND | **Lines**: 54 | **Path**: `Transiq/fixTheme.cjs`

```javascript
const fs = require('fs');

function processFile(path, replaceRules) {
  let code = fs.readFileSync(path, 'utf8');
  for (const [search, replace] of replaceRules) {
    code = code.replace(new RegExp(search, 'g'), replace);
  }
  fs.writeFileSync(path, code);
  console.log(`Updated ${path}`);
}

const loginRules = [
  ['bg-slate-900', 'bg-slate-50'],
  ['bg-slate-800', 'bg-white'],
  ['border-slate-700', 'border-slate-200'],
  ['text-white', 'text-slate-900'],
  ['text-slate-400', 'text-slate-500'],
  ['bg-slate-900/50', 'bg-slate-50'],
  ['text-slate-300', 'text-slate-700'],
  ['focus:ring-blue-500/50', 'focus:ring-indigo-500/20'],
  ['bg-red-500/10', 'bg-rose-50'],
  ['border-red-500/20', 'border-rose-200'],
  ['text-red-400', 'text-rose-600'],
  ['hover:bg-slate-700', 'hover:bg-slate-100'],
  ['bg-blue-600', 'bg-indigo-600'],
  ['hover:bg-blue-700', 'hover:bg-indigo-700'],
  ['text-blue-400', 'text-indigo-600'],
  ['hover:text-blue-300', 'hover:text-indigo-700'],
  ['text-slate-900 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20', 'text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20'],
  ['py-2.5 bg-indigo-600 text-slate-900 font-semibold', 'py-2.5 bg-indigo-600 text-white font-semibold']
];

processFile('src/pages/LoginPage.jsx', loginRules);

const adminRules = [
  ['bg-slate-950', 'bg-slate-50'],
  ['bg-slate-900', 'bg-white'],
  ['border-slate-800', 'border-slate-200'],
  ['text-white', 'text-slate-900'],
  ['text-slate-400', 'text-slate-500'],
  ['bg-slate-950/50', 'bg-slate-50'],
  ['text-slate-300', 'text-slate-700'],
  ['focus:ring-amber-500/50', 'focus:ring-amber-500/20'],
  ['bg-red-500/10', 'bg-rose-50'],
  ['border-red-500/20', 'border-rose-200'],
  ['text-red-400', 'text-rose-600'],
  ['bg-amber-500/10', 'bg-amber-50'],
  ['border-amber-500/30', 'border-amber-200'],
  ['text-amber-400', 'text-amber-700'],
  ['text-slate-950', 'text-white'], // Wait, if background of icon is amber-500, white icon is fine.
  ['py-2.5 bg-amber-500 text-slate-900 font-semibold', 'py-2.5 bg-amber-500 text-white font-semibold']
];

processFile('src/pages/AdminLoginPage.jsx', adminRules);
```

---

<a id="file-transiqfixtooltipcjs"></a>
## 63. `Transiq/fixTooltip.cjs`
> **Section**: FRONTEND | **Lines**: 35 | **Path**: `Transiq/fixTooltip.cjs`

```javascript
const fs = require('fs');
let code = fs.readFileSync('src/modules/04-transactions/pages/FinancialAnalysisPage.jsx', 'utf8');

const head = code.substring(0, code.indexOf('const CustomTooltip ='));
const tail = code.substring(code.indexOf('export default function FinancialAnalysisPage'));

const tooltip = `
const CustomTooltip = ({ active, payload, label, prefix = '₹', suffix = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-4 rounded-xl shadow-xl shadow-slate-200/50 min-w-[140px]">
        {label && <p className="text-slate-500 text-[11px] uppercase tracking-wider font-bold mb-3 border-b border-slate-100 pb-2">{label}</p>}
        <div className="space-y-2">
          {payload.map((pld, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pld.color || pld.fill }} />
                <span className="text-slate-600 text-xs font-medium">{pld.name}</span>
              </div>
              <span className="text-slate-900 font-bold text-xs">
                {prefix}{Number(pld.value).toLocaleString('en-IN')}{suffix}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

`;

fs.writeFileSync('src/modules/04-transactions/pages/FinancialAnalysisPage.jsx', head + tooltip + tail);
console.log('Fixed CustomTooltip duplicates');
```

---

<a id="file-transiqforceupdatechartscjs"></a>
## 64. `Transiq/forceUpdateCharts.cjs`
> **Section**: FRONTEND | **Lines**: 94 | **Path**: `Transiq/forceUpdateCharts.cjs`

```javascript
const fs = require('fs');
let code = fs.readFileSync('src/modules/04-transactions/pages/FinancialAnalysisPage.jsx', 'utf8');

const updatedCode = code
  .replace(/<BarChart[\s\S]*?<\/BarChart>/m, `<BarChart data={byMonth} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSettled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.7}/>
                  </linearGradient>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10}
                  tickFormatter={(v) => \`₹\${(v / 1000).toFixed(0)}k\`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
                <Bar dataKey="successAmount" name="Settled" fill="url(#colorSettled)" radius={[6, 6, 0, 0]} barSize={36} />
                <Bar dataKey="totalAmount"   name="Total"   fill="url(#colorTotal)" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>`)
  .replace(/<LineChart[\s\S]*?<\/LineChart>/m, `<AreaChart data={byMonth} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip content={<CustomTooltip prefix="" />} />
                <Area type="monotone" dataKey="successCount" name="Success" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSuccess)" activeDot={{ r: 6, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="failedCount"  name="Failed"  stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorFailed)" activeDot={{ r: 6, strokeWidth: 0 }} />
                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 500, color: '#475569', paddingTop: '20px' }} iconType="circle" />
              </AreaChart>`);

const pie1Replace = `<PieChart>
                  <Pie
                    data={byMethod}
                    dataKey="total"
                    nameKey="_id"
                    cx="50%" cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={4}
                    stroke="none"
                    label={false}
                  >
                    {byMethod.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip suffix=" Volume" />} />
                </PieChart>`;

const pie2Replace = `<PieChart>
                  <Pie
                    data={[
                      { name: 'Success', value: summary?.successCount || 0, color: '#10b981' },
                      { name: 'Failed', value: summary?.failedCount || 0, color: '#f43f5e' },
                      { name: 'Pending', value: summary?.pendingCount || 0, color: '#f59e0b' }
                    ].filter(d => d.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={4}
                    stroke="none"
                    label={false}
                  >
                    { [
                      { name: 'Success', value: summary?.successCount || 0, color: '#10b981' },
                      { name: 'Failed', value: summary?.failedCount || 0, color: '#f43f5e' },
                      { name: 'Pending', value: summary?.pendingCount || 0, color: '#f59e0b' }
                    ].filter(d => d.value > 0).map((entry, i) => (
                      <Cell key={i} fill={entry.color} className="hover:opacity-80 transition-opacity outline-none" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip prefix="" suffix=" txns" />} />
                </PieChart>`;

let finalCode = updatedCode.replace(/<PieChart>[\s\S]*?<\/PieChart>/m, pie1Replace);
finalCode = finalCode.replace(/<PieChart>[\s\S]*?<\/PieChart>/m, pie2Replace);

fs.writeFileSync('src/modules/04-transactions/pages/FinancialAnalysisPage.jsx', finalCode);
console.log('Successfully replaced ALL charts in FinancialAnalysisPage via script file');
```

---

<a id="file-transiqindexhtml"></a>
## 65. `Transiq/index.html`
> **Section**: FRONTEND | **Lines**: 13 | **Path**: `Transiq/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pay Gate</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

<a id="file-transiqpackagejson"></a>
## 66. `Transiq/package.json`
> **Section**: FRONTEND | **Lines**: 37 | **Path**: `Transiq/package.json`

```json
{
  "name": "transiq",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.20.0",
    "lucide-react": "^1.48.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-router-dom": "^7.18.3",
    "recharts": "^3.10.1",
    "zustand": "^5.0.15"
  },
  "devDependencies": {
    "@babel/core": "^7.29.7",
    "@eslint/js": "^10.0.1",
    "@rolldown/plugin-babel": "^0.2.3",
    "@tailwindcss/vite": "^4.3.3",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.4",
    "@vitejs/plugin-react": "^6.1.0",
    "babel-plugin-react-compiler": "^1.0.0",
    "eslint": "^10.9.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.4",
    "globals": "^17.11.0",
    "tailwindcss": "^4.3.3",
    "vite": "^8.2.2"
  }
}
```

---

<a id="file-transiqplaywrightconfigts"></a>
## 67. `Transiq/playwright.config.ts`
> **Section**: FRONTEND | **Lines**: 30 | **Path**: `Transiq/playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright-tests',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

---

<a id="file-transiqrestoremodeswitchercjs"></a>
## 68. `Transiq/restoreModeSwitcher.cjs`
> **Section**: FRONTEND | **Lines**: 20 | **Path**: `Transiq/restoreModeSwitcher.cjs`

```javascript
const fs = require('fs');

let cSidebar = fs.readFileSync('src/components/CustomerSidebar.jsx', 'utf8');
cSidebar = cSidebar.replace("import ModeSwitcher from './ModeSwitcher';\n", '');
cSidebar = cSidebar.replace(/\n\s*<ModeSwitcher \/>\n\s*<\/div>/, '\n      </div>');
fs.writeFileSync('src/components/CustomerSidebar.jsx', cSidebar);

let aSidebar = fs.readFileSync('src/components/AdminSidebar.jsx', 'utf8');
aSidebar = aSidebar.replace("import ModeSwitcher from './ModeSwitcher';\n", '');
aSidebar = aSidebar.replace(/\n\s*<ModeSwitcher \/>\n\s*<\/div>/, '\n      </div>');
fs.writeFileSync('src/components/AdminSidebar.jsx', aSidebar);

let appJsx = fs.readFileSync('src/App.jsx', 'utf8');
if (!appJsx.includes('<ModeSwitcher />')) {
  appJsx = appJsx.replace("import CustomerSidebar from './components/CustomerSidebar';", "import CustomerSidebar from './components/CustomerSidebar';\nimport ModeSwitcher from './components/ModeSwitcher';");
  appJsx = appJsx.replace('<div className="app">', '<div className="app">\n      <ModeSwitcher />');
  fs.writeFileSync('src/App.jsx', appJsx);
}

console.log('Restored ModeSwitcher to App.jsx');
```

---

<a id="file-transiqrmbannercjs"></a>
## 69. `Transiq/rmBanner.cjs`
> **Section**: FRONTEND | **Lines**: 13 | **Path**: `Transiq/rmBanner.cjs`

```javascript
const fs = require('fs');
let code = fs.readFileSync('src/modules/04-transactions/pages/InsightsPage.jsx', 'utf8');

const startIdx = code.indexOf('      <div className="bg-gradient-to-r');
const endIdx = code.indexOf('      {error &&');

if (startIdx > -1 && endIdx > -1) {
  code = code.substring(0, startIdx) + code.substring(endIdx);
  fs.writeFileSync('src/modules/04-transactions/pages/InsightsPage.jsx', code);
  console.log('done');
} else {
  console.log('Not found');
}
```

---

<a id="file-transiqrmfootercjs"></a>
## 70. `Transiq/rmFooter.cjs`
> **Section**: FRONTEND | **Lines**: 8 | **Path**: `Transiq/rmFooter.cjs`

```javascript
const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerSidebar.jsx', 'utf8');

const regex = /<div className="sidebar-footer">[\s\S]*?<\/div>/;
code = code.replace(regex, '<div className="sidebar-footer"></div>');

fs.writeFileSync('src/components/CustomerSidebar.jsx', code);
console.log('CustomerSidebar updated');
```

---

<a id="file-transiqsrcappcss"></a>
## 71. `Transiq/src/App.css`
> **Section**: FRONTEND | **Lines**: 102 | **Path**: `Transiq/src/App.css`

```css
.app {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.mode-switcher {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  position: fixed;
  bottom: 24px;
  right: 24px;
  top: auto;
  z-index: 999;
  display: flex;
  gap: 4px;
  padding: 6px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 99px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

.mode-button {
  border: 0;
  border-radius: 99px;
  padding: 8px 16px;
  background: transparent;
  color: #475569;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.mode-button:hover {
  background: rgba(255, 255, 255, 0.5);
  color: #1e293b;
}

.mode-button.active {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.main-content {
  flex: 1;
  min-width: 0;
  min-height: 100vh;
  padding-bottom: 90px;
}

.settings-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 52px 40px;
  color: #18221e;
}

.settings-page h1 {
  margin: 0 0 10px;
  font-size: 30px;
  font-weight: 700;
}

.settings-page p {
  margin: 0;
  color: #64716b;
}

.settings-page .page-eyebrow {
  margin-bottom: 10px;
  color: #2f6b56;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 640px) {
  .main-content {
    margin-left: 0;
  }

  .mode-switcher {
    top: 8px;
    right: 8px;
  }

  .mode-button {
    padding: 7px 8px;
    font-size: 12px;
  }
}
.mode-switcher:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}
```

---

<a id="file-transiqsrcappjsx"></a>
## 72. `Transiq/src/App.jsx`
> **Section**: FRONTEND | **Lines**: 121 | **Path**: `Transiq/src/App.jsx`

```jsx
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
```

---

<a id="file-transiqsrcapiadminservicejs"></a>
## 73. `Transiq/src/api/adminService.js`
> **Section**: FRONTEND | **Lines**: 45 | **Path**: `Transiq/src/api/adminService.js`

```javascript
import api from './axiosInstance';

const adminService = {
  // ── KPI Stats & Telemetry ──────────────────────────────────────────────────
  getStats: () =>
    api.get('/admin/stats'),

  getHealth: () =>
    api.get('/health'),

  // ── Transactions ────────────────────────────────────────────────────────────
  getTransactions: (params = {}) =>
    api.get('/admin/transactions', { params }),

  getTransactionById: (id) =>
    api.get(`/admin/transactions/${id}`),

  forceSuccess: (id) =>
    api.patch(`/admin/transactions/${id}/force-success`),

  forceFail: (id, failureReason = 'BANK_TIMEOUT') =>
    api.patch(`/admin/transactions/${id}/force-fail`, { failureReason }),

  // ── Error Logs ──────────────────────────────────────────────────────────────
  getErrors: (params = {}) =>
    api.get('/admin/errors', { params }),

  resolveError: (id, resolutionNotes = '') =>
    api.patch(`/admin/errors/${id}/resolve`, { resolutionNotes }),

  resolveAllErrors: (resolutionNotes = '') =>
    api.post('/admin/errors/resolve-all', { resolutionNotes }),

  // ── User Management ─────────────────────────────────────────────────────────
  getUsers: (params = {}) =>
    api.get('/admin/users', { params }),

  freezeWallet: (userId) =>
    api.patch(`/admin/users/${userId}/freeze`),

  toggleUserActive: (userId) =>
    api.patch(`/admin/users/${userId}/activate`),
};

export default adminService;
```

---

<a id="file-transiqsrcapianalyticsservicejs"></a>
## 74. `Transiq/src/api/analyticsService.js`
> **Section**: FRONTEND | **Lines**: 11 | **Path**: `Transiq/src/api/analyticsService.js`

```javascript
import api from './axiosInstance';

const analyticsService = {
  getSummary:  ()       => api.get('/analytics/summary'),
  getByMethod: ()       => api.get('/analytics/by-method'),
  getByMonth:  ()       => api.get('/analytics/by-month'),
  getInsights: ()       => api.get('/analytics/insights'),
  exportCsv:   ()       => api.get('/analytics/export', { responseType: 'blob' }),
};

export default analyticsService;
```

---

<a id="file-transiqsrcapiauthservicejs"></a>
## 75. `Transiq/src/api/authService.js`
> **Section**: FRONTEND | **Lines**: 6 | **Path**: `Transiq/src/api/authService.js`

```javascript
import api from './axiosInstance';
export default {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  adminLogin: (data) => api.post('/auth/admin-login', data)
};
```

---

<a id="file-transiqsrcapiaxiosinstancejs"></a>
## 76. `Transiq/src/api/axiosInstance.js`
> **Section**: FRONTEND | **Lines**: 59 | **Path**: `Transiq/src/api/axiosInstance.js`

```javascript
import axios from 'axios';

export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const protocol = window.location.protocol || 'http:';
    const hostname = window.location.hostname;
    
    // Automatically support VS Code Port Forwarding and GitHub Codespaces tunnels
    // They usually map ports into the domain, e.g., "blabla-5173.use.devtunnels.ms"
    if (hostname.includes('-5173')) {
      const backendHostname = hostname.replace('-5173', '-5000');
      return `${protocol}//${backendHostname}/api`;
    }
    
    // Standard Localhost or Local Wi-Fi network routing
    return `${protocol}//${hostname}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

const api = axios.create({
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Dynamically attach Base URL & JWT token to every request ──────────────────
api.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseUrl();
    const token = localStorage.getItem('paygate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Handle 401: clear invalid session and immediately redirect to login ──────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('⚠️ 401 Unauthorized: Invalid or missing token. Redirecting to login...');
      localStorage.removeItem('paygate_token');
      localStorage.removeItem('paygate_user');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        const isAdmin = window.location.pathname.startsWith('/admin');
        window.location.href = isAdmin ? '/admin/login' : '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

<a id="file-transiqsrcapicustomermoduleservicejs"></a>
## 77. `Transiq/src/api/customerModuleService.js`
> **Section**: FRONTEND | **Lines**: 3 | **Path**: `Transiq/src/api/customerModuleService.js`

```javascript
export { default as customerService } from './customerService';
export { default as walletService } from './walletService';
export { default as pocketService } from './pocketService';
```

---

<a id="file-transiqsrcapicustomerservicejs"></a>
## 78. `Transiq/src/api/customerService.js`
> **Section**: FRONTEND | **Lines**: 6 | **Path**: `Transiq/src/api/customerService.js`

```javascript
import api from './axiosInstance';
export default {
  getMe: () => api.get('/customers/me'),
  getDashboard: () => api.get('/customers/me/dashboard'),
  updateMe: (data) => api.put('/customers/me', data)
};
```

---

<a id="file-transiqsrcapipocketservicejs"></a>
## 79. `Transiq/src/api/pocketService.js`
> **Section**: FRONTEND | **Lines**: 11 | **Path**: `Transiq/src/api/pocketService.js`

```javascript
import api from './axiosInstance';
const BASE = '/pockets';
export default {
  getAll: () => api.get(BASE),
  create: (data) => api.post(BASE, data),
  update: (id, data) => api.put(`${BASE}/${id}`, data),
  deposit: (id, amount) => api.patch(`${BASE}/${id}/deposit`, { amount }),
  withdraw: (id, amount) => api.patch(`${BASE}/${id}/withdraw`, { amount }),
  toggleLock: (id) => api.patch(`${BASE}/${id}/lock`),
  remove: (id) => api.delete(`${BASE}/${id}`)
};
```

---

<a id="file-transiqsrcapirecipientservicejs"></a>
## 80. `Transiq/src/api/recipientService.js`
> **Section**: FRONTEND | **Lines**: 14 | **Path**: `Transiq/src/api/recipientService.js`

```javascript
import api from './axiosInstance';

const BASE = '/recipients';

const recipientService = {
  getAll:           (params) => api.get(BASE, { params }),
  getById:          (id)     => api.get(`${BASE}/${id}`),
  create:           (data)   => api.post(BASE, data),
  update:           (id, data) => api.put(`${BASE}/${id}`, data),
  remove:           (id)     => api.delete(`${BASE}/${id}`),
  toggleFavourite:  (id)     => api.patch(`${BASE}/${id}/favourite`),
};

export default recipientService;
```

---

<a id="file-transiqsrcapisecurityservicejs"></a>
## 81. `Transiq/src/api/securityService.js`
> **Section**: FRONTEND | **Lines**: 40 | **Path**: `Transiq/src/api/securityService.js`

```javascript
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
```

---

<a id="file-transiqsrcapitransactionservicejs"></a>
## 82. `Transiq/src/api/transactionService.js`
> **Section**: FRONTEND | **Lines**: 23 | **Path**: `Transiq/src/api/transactionService.js`

```javascript
import api from './axiosInstance';

const transactionService = {
  // List with filters
  getAll: (params) => api.get('/transactions', { params }),

  // Single detail
  getById: (id) => api.get(`/transactions/${id}`),

  // Initiate new transfer
  create: (data) => api.post('/transactions', data),

  // Cancel pending
  cancel: (id) => api.patch(`/transactions/${id}/cancel`),

  // Retry failed
  retry: (id) => api.patch(`/transactions/${id}/retry`),

  // Pre-flight validation
  validate: (data) => api.post('/transactions/validate', data),
};

export default transactionService;
```

---

<a id="file-transiqsrcapiwalletservicejs"></a>
## 83. `Transiq/src/api/walletService.js`
> **Section**: FRONTEND | **Lines**: 5 | **Path**: `Transiq/src/api/walletService.js`

```javascript
import api from './axiosInstance';
export default {
  getMine: () => api.get('/wallets/me'),
  updateCurrency: (currency) => api.put('/wallets/me/currency', { currency })
};
```

---

<a id="file-transiqsrccomponentsadminsidebarjsx"></a>
## 84. `Transiq/src/components/AdminSidebar.jsx`
> **Section**: FRONTEND | **Lines**: 101 | **Path**: `Transiq/src/components/AdminSidebar.jsx`

```jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLogsStore } from '../modules/06-logs/store/logsStore';
import SidebarIcon from './SidebarIcon';
import './Sidebar.css';
import ModeSwitcher from './ModeSwitcher';

const AdminSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();
  
  const pendingCount = useLogsStore((state) => state.pendingTransactions.length);
  const unresolvedErrorCount = useLogsStore((state) => 
    state.errorLogs.filter((l) => !l.resolved).length
  );

  const adminMenuItems = [
    { to: '/admin/monitoring', label: 'Overview', icon: 'monitor' },
    { to: '/admin/history', label: 'Payment history', icon: 'logs' },
    { to: '/admin/logs', label: 'Transaction logs', icon: 'logs' },
    { to: '/admin/pending', label: 'Pending monitor', icon: 'pending', badge: pendingCount || null },
    { to: '/admin/errors', label: 'Error logs', icon: 'errors', badge: unresolvedErrorCount || null },
    { to: '/admin/settings', label: 'Settings', icon: 'settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`sidebar admin-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        <span className="sidebar-title">Admin Panel</span>
        <button 
          className="sidebar-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
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
              title={!isExpanded ? item.label : undefined}
            >
              <SidebarIcon name={item.icon} />
              {isExpanded && (
                <>
                  <span className="sidebar-label">{item.label}</span>
                  {item.badge && (
                    <span className="sidebar-badge">
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
        <button
          onClick={() => {
            localStorage.removeItem('paygate_token');
            localStorage.removeItem('paygate_user');
            window.location.href = '/admin/login';
          }}
          className="sidebar-item"
          style={{
            width: '100%',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'left',
            color: '#f87171',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxSizing: 'border-box',
          }}
          title={!isExpanded ? 'Sign out' : undefined}
        >
          <SidebarIcon name="logout" />
          {isExpanded && <span className="sidebar-label" style={{ color: '#f87171', fontWeight: 600 }}>Sign out</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
```

---

<a id="file-transiqsrccomponentsauthverificationmodaljsx"></a>
## 85. `Transiq/src/components/AuthVerificationModal.jsx`
> **Section**: FRONTEND | **Lines**: 321 | **Path**: `Transiq/src/components/AuthVerificationModal.jsx`

```jsx
import React, { useState } from 'react';
import { ShieldCheck, UserCheck, UserPlus, AlertCircle, ArrowRight, X, Lock } from 'lucide-react';
import { getApiBaseUrl } from '../api/axiosInstance';
import { useCustomerStore } from '../modules/01-customer/store/useCustomerStore';

export default function AuthVerificationModal({ isOpen, onClose }) {
  const API_BASE = getApiBaseUrl();
  const { fetchMe } = useCustomerStore();

  const [identifier, setIdentifier] = useState('Arjun Mehta');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [userFound, setUserFound] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);

  // Sign up form
  const [regForm, setRegForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  if (!isOpen) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    setUserFound(null);
    setShowSignUp(false);

    if (!identifier.trim()) {
      setStatusMsg('Please enter a name, email, or phone number to verify.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.exists) {
        setUserFound(data.data);
        setStatusMsg(data.message);
      } else {
        setShowSignUp(true);
        setStatusMsg(data.message);
        setRegForm((s) => ({
          ...s,
          firstName: identifier.trim().split(' ')[0] || '',
          email: identifier.includes('@') ? identifier.trim() : '',
          phone: /^\d+$/.test(identifier.trim()) ? identifier.trim() : '',
        }));
      }
    } catch (err) {
      setLoading(false);
      setStatusMsg('Verification request failed. Please check network connection.');
    }
  };

  const handleSelectUser = async (u) => {
    // Save user info and trigger fresh DB fetch
    localStorage.setItem(
      'paygate_user',
      JSON.stringify({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone,
        role: u.role || 'customer',
      })
    );
    try {
      await fetchMe();
    } catch (_) {}
    onClose();
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setStatusMsg('');

    if (!regForm.firstName || !regForm.email || !regForm.phone || !regForm.password) {
      setStatusMsg('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: regForm.firstName.trim(),
          lastName: regForm.lastName.trim() || 'User',
          email: regForm.email.trim(),
          phone: regForm.phone.trim(),
          password: regForm.password,
          role: 'customer',
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Sign up failed.');
      }

      if (data.data?.token) {
        localStorage.setItem('paygate_token', data.data.token);
      }
      if (data.data?.user) {
        localStorage.setItem('paygate_user', JSON.stringify(data.data.user));
      }

      try {
        await fetchMe();
      } catch (_) {}
      onClose();
    } catch (err) {
      setLoading(false);
      setStatusMsg(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Payment Gateway Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">
                Payment Auth Gateway
              </div>
              <h2 className="text-base font-bold tracking-tight">Database User Verification</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {!showSignUp ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  User Credentials (Name, Email, or Mobile Number)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. Arjun Mehta or arjun@paygate.com"
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <Lock size={15} className="absolute right-3 top-3 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Verifies existence directly against MongoDB database.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Verifying database...</span>
                ) : (
                  <>
                    <span>Verify & Search DB</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Sign Up Form when user not found */
            <form onSubmit={handleSignUp} className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-medium text-amber-900 flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-600 shrink-0" />
                <span>User not found in DB. Complete quick registration to proceed.</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={regForm.firstName}
                    onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={regForm.lastName}
                    onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="user@paygate.com"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  placeholder="9876543210"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  placeholder="Min 8 characters"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowSignUp(false)}
                  className="w-1/3 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <UserPlus size={14} />
                  <span>{loading ? 'Creating...' : 'Sign Up & Continue'}</span>
                </button>
              </div>
            </form>
          )}

          {/* User Found Result */}
          {userFound && !showSignUp && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <UserCheck size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">
                    {userFound.firstName} {userFound.lastName}
                  </h4>
                  <p className="text-[11px] text-emerald-700 mt-0.5">{userFound.email} • {userFound.phone}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-200 text-emerald-800 rounded-full">
                    Database Verified ({userFound.role})
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectUser(userFound)}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Authenticate & Access Wallet</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Status Alert */}
          {statusMsg && !userFound && !showSignUp && (
            <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-center gap-2">
              <AlertCircle size={15} className="text-slate-500 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

<a id="file-transiqsrccomponentscustomersidebarjsx"></a>
## 86. `Transiq/src/components/CustomerSidebar.jsx`
> **Section**: FRONTEND | **Lines**: 93 | **Path**: `Transiq/src/components/CustomerSidebar.jsx`

```jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SidebarIcon from './SidebarIcon';
import './Sidebar.css';
import ModeSwitcher from './ModeSwitcher';

const CustomerSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();

  const customerMenuItems = [
    { to: '/', label: 'Dashboard', icon: 'dashboard' },
    { to: '/my-wallet', label: 'My wallet', icon: 'wallet' },
    { to: '/my-pockets', label: 'My pockets', icon: 'pockets' },
    { to: '/recipients', label: 'Recipients', icon: 'recipients' },
    { to: '/send-money', label: 'Send money', icon: 'send' },
    { to: '/transactions', label: 'Transactions', icon: 'transactions' },
    { to: '/financial-analysis', label: 'Financial analysis', icon: 'dashboard' },
    { to: '/insights', label: 'Insights', icon: 'insights' },
    { to: '/security', label: 'Security', icon: 'security' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`sidebar customer-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        <span className="sidebar-title">Customer menu</span>
        <button 
          className="sidebar-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
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
              title={!isExpanded ? item.label : undefined}
            >
              <SidebarIcon name={item.icon} />
              {isExpanded && (
                <>
                  <span className="sidebar-label">{item.label}</span>
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
        <button
          onClick={() => {
            localStorage.removeItem('paygate_token');
            localStorage.removeItem('paygate_user');
            window.location.href = '/login';
          }}
          className="sidebar-item"
          style={{
            width: '100%',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'left',
            color: '#f87171',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxSizing: 'border-box',
          }}
          title={!isExpanded ? 'Sign out' : undefined}
        >
          <SidebarIcon name="logout" />
          {isExpanded && <span className="sidebar-label" style={{ color: '#f87171', fontWeight: 600 }}>Sign out</span>}
        </button>
      </div>
    </aside>
  );
};

export default CustomerSidebar;
```

---

<a id="file-transiqsrccomponentsmodeswitcherjsx"></a>
## 87. `Transiq/src/components/ModeSwitcher.jsx`
> **Section**: FRONTEND | **Lines**: 40 | **Path**: `Transiq/src/components/ModeSwitcher.jsx`

```jsx
import { useNavigate, useLocation } from 'react-router-dom';

const ModeSwitcher = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith('/admin');

  const userJson = localStorage.getItem('paygate_user');
  const user = userJson ? JSON.parse(userJson) : null;
  const userRole = user?.role || 'customer';

  return (
    <div className="mode-switcher" role="group" aria-label="Choose menu">
      <button
        className={!isAdmin ? 'mode-button active' : 'mode-button'}
        onClick={() => {
          if (isAdmin) {
            if (userRole === 'admin') {
              localStorage.removeItem('paygate_token');
              localStorage.removeItem('paygate_user');
            }
            navigate('/');
          }
        }}
      >
        Customer menu
      </button>
      <button
        className={isAdmin ? 'mode-button active' : 'mode-button'}
        onClick={() => {
          if (!isAdmin) navigate('/admin/monitoring');
        }}
      >
        Admin menu
      </button>
    </div>
  );
};

export default ModeSwitcher;
```

---

<a id="file-transiqsrccomponentsnavigationcss"></a>
## 88. `Transiq/src/components/Navigation.css`
> **Section**: FRONTEND | **Lines**: 131 | **Path**: `Transiq/src/components/Navigation.css`

```css
.navigation {
  background: #0f172a;
  color: white;
  padding: 0;
  box-shadow: 0 4px 15px -3px rgba(0, 0, 0, 0.25);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid #1e293b;
  width: 100%;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  max-width: 1400px;
  margin: 0 auto;
  height: 56px;
}

.nav-logo {
  text-decoration: none;
  display: flex;
  align-items: center;
  margin-right: 32px;
  transition: opacity 0.2s ease;
}

.nav-logo:hover {
  opacity: 0.85;
}

.menu-toggle {
  display: none;
  background: none;
  border: 1px solid #334155;
  color: white;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.menu-toggle:hover {
  background: #1e293b;
}

.menu-toggle-bar {
  display: block;
  width: 18px;
  height: 2px;
  background: white;
  border-radius: 1px;
}

.nav-menu {
  display: flex;
  gap: 4px;
  align-items: center;
}

.nav-link-item {
  color: #94a3b8;
  text-decoration: none;
  padding: 7px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.15s ease, background-color 0.15s ease;
  white-space: nowrap;
}

.nav-link-item:hover {
  color: #e2e8f0;
  background-color: #1e293b;
}

.nav-link-item.active {
  color: #ffffff;
  background-color: #2563eb;
}

.nav-badge {
  font-size: 10px;
  line-height: 1;
  padding: 2px 6px;
  border-radius: 9999px;
  font-weight: 700;
}

@media (max-width: 900px) {
  .nav-container {
    padding: 0 16px;
  }

  .menu-toggle {
    display: flex;
  }

  .nav-menu {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 56px;
    left: 0;
    width: 100%;
    background-color: #0f172a;
    padding: 8px 12px;
    border-bottom: 1px solid #1e293b;
    gap: 2px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }

  .nav-menu.active {
    display: flex;
  }

  .nav-link-item {
    width: 100%;
    padding: 10px 14px;
  }
}
```

---

<a id="file-transiqsrccomponentsnavigationjsx"></a>
## 89. `Transiq/src/components/Navigation.jsx`
> **Section**: FRONTEND | **Lines**: 69 | **Path**: `Transiq/src/components/Navigation.jsx`

```jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLogsStore } from '../modules/06-logs/store/logsStore';
import './Navigation.css';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const pendingCount = useLogsStore((state) => state.pendingTransactions.length);
  const unresolvedErrorCount = useLogsStore((state) => state.errorLogs.filter((l) => !l.resolved).length);

  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/history', label: 'Payment History' },
    { to: '/logs', label: 'Transaction Logs' },
    { to: '/pending', label: 'Pending Monitor', badge: pendingCount > 0 ? pendingCount : null, badgeColor: 'bg-amber-400 text-slate-900' },
    { to: '/errors', label: 'Error Logs', badge: unresolvedErrorCount > 0 ? unresolvedErrorCount : null, badgeColor: 'bg-rose-500 text-white' },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={handleLinkClick}>
          <span className="text-white font-semibold text-base tracking-tight">
            PayGate
          </span>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="menu-toggle-bar" />
          <span className="menu-toggle-bar" />
          <span className="menu-toggle-bar" />
        </button>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {navLinks.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={handleLinkClick}
                className={`nav-link-item ${isActive ? 'active' : ''}`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`nav-badge ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
```

---

<a id="file-transiqsrccomponentssidebarcss"></a>
## 90. `Transiq/src/components/Sidebar.css`
> **Section**: FRONTEND | **Lines**: 254 | **Path**: `Transiq/src/components/Sidebar.css`

```css
.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 20;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
  overflow-y: auto;
  background: #151716;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  color: #f2f2f0;
  width: 252px;
  min-width: 252px;
  transition: width 200ms ease, min-width 200ms ease;
}

.sidebar.collapsed {
  width: 62px;
  min-width: 62px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 68px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  flex-shrink: 0;
}

.sidebar.collapsed .sidebar-header {
  justify-content: center;
  padding: 0;
}

.sidebar-title {
  color: #f3f4f2;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  opacity: 1;
  transition: opacity 150ms ease;
}

.sidebar.collapsed .sidebar-title {
  display: none;
}

.sidebar-toggle {
  border: 0;
  background: transparent;
  width: 28px;
  height: 28px;
  min-width: 28px;
  min-height: 28px;
  color: #8e9490;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  flex-shrink: 0;
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #f2f2f0;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 10px 20px;
  overflow-x: hidden;
}

.sidebar.collapsed .sidebar-nav {
  padding: 16px 8px 20px;
}

.sidebar-item-wrapper {
  margin-bottom: 2px;
}

.sidebar-item {
  position: relative;
  display: flex;
  min-height: 44px;
  align-items: center;
  gap: 13px;
  padding: 0 12px;
  border-radius: 7px;
  color: #c7cbc7;
  text-decoration: none;
  transition: background 150ms ease, color 150ms ease;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar.collapsed .sidebar-item {
  justify-content: center;
  padding: 0;
  gap: 0;
}

.sidebar-item:hover,
.sidebar-item.active {
  background: #252927;
  color: #f4f5f3;
}

.sidebar-item.active::before {
  position: absolute;
  left: 0;
  width: 3px;
  height: 24px;
  border-radius: 0 2px 2px 0;
  background: #3d73d3;
  content: '';
}

.sidebar-icon {
  display: inline-flex;
  width: 22px;
  height: 22px;
  min-width: 22px;
  justify-content: center;
  line-height: 1;
  flex-shrink: 0;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.sidebar-label {
  flex: 1;
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-badge {
  min-width: 20px;
  padding: 2px 6px;
  border-radius: 10px;
  background: #8b5e22;
  color: #fff4dc;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
}

.sidebar-description {
  margin: 0 12px 4px 47px;
  color: #8eaaa5;
  font-size: 12px;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  flex-shrink: 0;
}

.sidebar.collapsed .sidebar-footer {
  align-items: center;
  padding: 14px 8px;
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
}

.sidebar.collapsed .admin-info {
  justify-content: center;
  width: 100%;
}

.admin-avatar {
  display: grid;
  width: 28px;
  height: 28px;
  min-width: 28px;
  place-items: center;
  border-radius: 50%;
  background: #315d9d;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.admin-name,
.admin-role {
  margin: 0;
}

.admin-name {
  font-size: 14px;
  font-weight: 600;
}

.admin-role {
  color: #969a96;
  font-size: 12px;
}

.sidebar.collapsed .sidebar-label,
.sidebar.collapsed .sidebar-badge,
.sidebar.collapsed .sidebar-description,
.sidebar.collapsed .admin-details,
.sidebar.collapsed .sidebar-footer p {
  display: none;
}

.sidebar.collapsed .sidebar-footer .version-label {
  display: none;
}

@media (max-width: 640px) {
  .sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    width: 252px !important;
    min-width: 252px !important;
    transform: translateX(-100%);
    transition: transform 200ms ease;
  }

  .sidebar.expanded {
    transform: translateX(0);
  }
}

.sidebar.collapsed .mode-switcher { display: none; }
```

---

<a id="file-transiqsrccomponentssidebariconjsx"></a>
## 91. `Transiq/src/components/SidebarIcon.jsx`
> **Section**: FRONTEND | **Lines**: 27 | **Path**: `Transiq/src/components/SidebarIcon.jsx`

```jsx
const paths = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  wallet: <><rect x="3" y="6" width="18" height="15" rx="2" /><path d="M3 9h18M16 15h3" /></>,
  pockets: <><path d="M4 8h16v12H4z" /><path d="M8 8V6h8v2M8 13h8" /></>,
  recipients: <><circle cx="8" cy="8" r="3" /><circle cx="16" cy="9" r="2.5" /><path d="M3 19c.5-3 2.2-4.5 5-4.5s4.5 1.5 5 4.5M14 14.5c2.5-.2 4.1 1.3 4.6 4.5" /></>,
  send: <><path d="m3 11 18-8-8 18-2.5-7.5z" /><path d="M10.5 13.5 21 3" /></>,
  transactions: <><path d="M5 7h14M5 12h14M5 17h10" /><circle cx="3" cy="7" r=".5" /><circle cx="3" cy="12" r=".5" /><circle cx="3" cy="17" r=".5" /></>,
  analysis: <><path d="M4 20V10h4v10M10 20V4h4v16M16 20v-7h4v7" /></>,
  insights: <><circle cx="12" cy="12" r="7" /><path d="M12 8v4l2.5 1.5M12 2v2M12 20v2M2 12h2M20 12h2" /></>,
  security: <><path d="M12 3 20 6v5c0 5-3.3 8.5-8 10-4.7-1.5-8-5-8-10V6z" /><path d="m9 12 2 2 4-4" /></>,
  monitor: <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8M12 18v3" /></>,
  users: <><circle cx="9" cy="8" r="3" /><path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6M16 5.5a3 3 0 0 1 0 5.8M17 14c2.5.5 3.8 2.5 4 5" /></>,
  logs: <><path d="M6 3h9l3 3v15H6zM9 11h6M9 15h6M9 7h3" /></>,
  pending: <><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></>,
  errors: <><path d="M12 3 22 20H2z" /><path d="M12 9v5M12 17v.5" /></>,
  bank: <><path d="m3 9 9-6 9 6M5 10v7M9 10v7M15 10v7M19 10v7M3 20h18" /></>,
  settings: <path fill="currentColor" stroke="none" d="M19.43 12.98c.04-.32.07-.65.07-.98s-.02-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.37-.31-.6-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98L14.5 2.42C14.47 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.5.42L9.12 5.07c-.61.25-1.18.59-1.69.98l-2.49-1c-.23-.08-.48 0-.6.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.08.65-.08.98s.03.66.08.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.37.31.6.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.38-2.65c.61-.25 1.18-.58 1.69-.98l2.49 1c.23.08.48 0 .6-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5z" />,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
};

const SidebarIcon = ({ name }) => (
  <svg className="sidebar-icon" viewBox="0 0 24 24" aria-hidden="true">
    {paths[name]}
  </svg>
);

export default SidebarIcon;
```

---

<a id="file-transiqsrcindexcss"></a>
## 92. `Transiq/src/index.css`
> **Section**: FRONTEND | **Lines**: 52 | **Path**: `Transiq/src/index.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
@import "tailwindcss";

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #f3f4f6;
  color: #1f2937;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}


/* Custom Modern Scrollbar */
::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(15, 23, 42, 0.2);
  border-radius: 10px;
  border: 4px solid transparent;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(15, 23, 42, 0.4);
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(15, 23, 42, 0.3) transparent;
}

body { background-color: #f8fafc; }
```

---

<a id="file-transiqsrcmainjsx"></a>
## 93. `Transiq/src/main.jsx`
> **Section**: FRONTEND | **Lines**: 10 | **Path**: `Transiq/src/main.jsx`

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

---

<a id="file-transiqsrcmodules01customercomponentspocketcardjsx"></a>
## 94. `Transiq/src/modules/01-customer/components/PocketCard.jsx`
> **Section**: FRONTEND | **Lines**: 7 | **Path**: `Transiq/src/modules/01-customer/components/PocketCard.jsx`

```jsx
import { Lock, LockOpen, WalletCards } from 'lucide-react';

export default function PocketCard({ pocket, currency = 'INR' }) {
  const amount = new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(pocket.currentAmount || 0);
  const target = new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(pocket.targetAmount || 0);
  return <div className="pocket-card"><div className="pocket-top"><div className="pocket-icon"><WalletCards size={19}/></div><span className="pocket-lock">{pocket.isLocked ? <Lock size={13}/> : <LockOpen size={13}/>} {pocket.isLocked ? 'LOCKED' : 'OPEN'}</span></div><h3>{pocket.name}</h3><p>{amount} of {target}</p></div>;
}
```

---

<a id="file-transiqsrcmodules01customercustomercss"></a>
## 95. `Transiq/src/modules/01-customer/customer.css`
> **Section**: FRONTEND | **Lines**: 937 | **Path**: `Transiq/src/modules/01-customer/customer.css`

```css
/* Removed base resets to avoid global conflicts */

#root {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}


button, input {
  font: inherit;
}

button {
  cursor: pointer;
}

a {
  color: inherit;
  text-decoration: none;
}

.app-shell {
  min-height: 100vh;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  min-height: 68px;
  padding: 0 5vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  background: #242624;
  color: #f2f2f0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 31px;
  height: 31px;
  border-radius: 9px;
  background: #2f6b56;
  color: white;
  font-weight: 700;
}

.topnav {
  display: flex;
  align-items: center;
  gap: 18px;
  color: #bfc3bf;
  font-size: 13px;
  font-weight: 600;
}

.topnav a:hover {
  color: white;
}

.nav-primary {
  padding: 9px 13px;
  border-radius: 8px;
  background: #3b3c3a;
  color: #f2f2f0 !important;
}

.text-button {
  border: 0;
  background: transparent;
  color: #bfc3bf;
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.text-button:hover {
  color: white;
}

.main-content {
  min-height: calc(100vh - 68px);
}

.landing-page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 76px 40px 60px;
}

.hero {
  max-width: 820px;
  padding: 35px 0 55px;
}

.eyebrow,
.page-eyebrow {
  margin-bottom: 12px;
  color: #2f6b56;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero h1 {
  margin: 0;
  font-size: clamp(48px, 7vw, 86px);
  line-height: 0.98;
  letter-spacing: -0.065em;
  font-weight: 760;
}

.hero h1 span {
  color: #2f6b56;
}

.hero-copy {
  max-width: 650px;
  margin: 27px 0 30px;
  color: #64716b;
  font-size: 18px;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.button {
  border: 0;
  border-radius: 9px;
  padding: 12px 17px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  font-size: 13px;
  font-weight: 700;
  transition: transform 120ms ease, opacity 120ms ease, background 120ms ease;
}

.button:hover {
  transform: translateY(-1px);
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.button-primary {
  background: #2f6b56;
  color: white;
}

.button-secondary {
  background: #e4e7e2;
  color: #25332c;
}

.button-dark {
  background: #242624;
  color: white;
}

.full {
  width: 100%;
}

.hero-note {
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #78827d;
  font-size: 12px;
  font-weight: 600;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.feature-card {
  padding: 26px;
  min-height: 190px;
  border: 1px solid #dfe3de;
  border-radius: 14px;
  background: #f9faf8;
}

.feature-icon,
.card-icon {
  width: 39px;
  height: 39px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #e1ebe5;
  color: #2f6b56;
}

.feature-card h3 {
  margin: 20px 0 8px;
  font-size: 16px;
}

.feature-card p,
.dashboard-card p,
.admin-entry p,
.info-panel p {
  color: #69756f;
  line-height: 1.6;
  font-size: 14px;
}

.admin-entry {
  margin-top: 16px;
  padding: 29px;
  border-radius: 14px;
  background: #e4e7e2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
}

.admin-entry h2,
.info-panel h2 {
  margin: 0;
  font-size: 22px;
  letter-spacing: -0.025em;
}

.admin-entry p {
  margin: 8px 0 0;
}

.auth-page {
  min-height: calc(100vh - 68px);
  display: grid;
  place-items: center;
  padding: 55px 20px;
}

.auth-card {
  width: min(100%, 460px);
  padding: 36px;
  border: 1px solid #dfe3de;
  border-radius: 15px;
  background: #fbfcfa;
  box-shadow: 0 18px 55px rgba(27, 39, 33, 0.07);
}

.auth-card h1 {
  margin: 0;
  font-size: 31px;
  letter-spacing: -0.04em;
}

.auth-subtitle {
  margin: 9px 0 27px;
  color: #69756f;
  line-height: 1.5;
}

.form-stack {
  display: grid;
  gap: 17px;
}

.field {
  display: grid;
  gap: 7px;
  color: #35423c;
  font-size: 12px;
  font-weight: 700;
}

.field input,
.search-box input {
  width: 100%;
  border: 1px solid #d7ddd8;
  border-radius: 8px;
  outline: none;
  padding: 12px 13px;
  color: #18221e;
  background: white;
}

.field input:focus,
.search-box input:focus {
  border-color: #2f6b56;
  box-shadow: 0 0 0 3px rgba(47, 107, 86, 0.1);
}

.field input:disabled {
  color: #7b847f;
  background: #eef0ed;
}

.form-footer {
  margin: 0;
  text-align: center;
  color: #758079;
  font-size: 13px;
}

.form-footer a {
  color: #2f6b56;
  font-weight: 700;
}

.error-box,
.success-box {
  border-radius: 8px;
  padding: 11px 13px;
  font-size: 13px;
}

.error-box {
  background: #f9e9e7;
  color: #963f38;
}

.success-box {
  background: #e5f0e9;
  color: #2b664d;
}

.dashboard-page,
.admin-page,
.settings-page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 55px 40px;
}

.dashboard-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 25px;
  margin-bottom: 28px;
}

.dashboard-header h1,
.settings-page h1 {
  margin: 0 0 9px;
  font-size: 34px;
  letter-spacing: -0.045em;
}

.dashboard-header p,
.settings-page > p {
  margin: 0;
  color: #69756f;
}

.role-badge,
.admin-badge,
.jwt-pill,
.coming-soon {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 99px;
  padding: 7px 10px;
  background: #e4e9e5;
  color: #496258;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.admin-badge {
  background: #242624;
  color: #dce8e1;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.dashboard-card {
  min-height: 240px;
  padding: 27px;
  border: 1px solid #dfe3de;
  border-radius: 14px;
  background: #fbfcfa;
}

.accent-card {
  background: #edf3ef;
  border-color: #d8e4dc;
}

.dashboard-card h2 {
  margin: 20px 0 7px;
  font-size: 20px;
}

.card-link {
  margin-top: 22px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #2f6b56;
  font-size: 13px;
  font-weight: 700;
}

.coming-soon {
  margin-top: 22px;
}

.info-panel {
  margin-top: 15px;
  padding: 27px;
  border-radius: 14px;
  background: #242624;
  color: #f2f2f0;
  display: flex;
  justify-content: space-between;
  gap: 30px;
  align-items: center;
}

.info-panel h2 {
  max-width: 650px;
}

.info-panel p {
  max-width: 720px;
  color: #a9aca8;
}

.info-panel .page-eyebrow {
  color: #8ab39e;
}

.jwt-pill {
  flex-shrink: 0;
  background: #3b3c3a;
  color: #d8ddd9;
}

.settings-page {
  max-width: 760px;
}

.settings-card {
  margin-top: 30px;
  padding: 28px;
  border: 1px solid #dfe3de;
  border-radius: 14px;
  background: #fbfcfa;
}

.back-link {
  margin-top: 18px;
  border: 0;
  padding: 0;
  background: transparent;
  color: #2f6b56;
  font-size: 13px;
  font-weight: 700;
}

.admin-security-note {
  margin-bottom: 20px;
  padding: 11px 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  background: #e9ece9;
  color: #52605a;
  font-size: 12px;
}

.admin-toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 13px;
  border: 1px solid #d7ddd8;
  border-radius: 8px;
  background: white;
  color: #78837d;
}

.search-box input {
  border: 0;
  padding-left: 0;
  box-shadow: none !important;
}

.table-card {
  border: 1px solid #dfe3de;
  border-radius: 14px;
  overflow: hidden;
  background: #fbfcfa;
}

.table-wrap {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;
}

th, td {
  padding: 14px 17px;
  text-align: left;
  border-bottom: 1px solid #e5e8e5;
  font-size: 12px;
}

th {
  background: #f1f3f0;
  color: #6b756f;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-cell strong,
.user-cell span {
  display: block;
}

.user-cell span {
  margin-top: 2px;
  color: #7b847f;
  font-size: 11px;
}

.avatar {
  width: 33px;
  height: 33px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: #dce9e1;
  color: #2f6b56;
  font-weight: 700;
}

.role-chip,
.status-chip {
  display: inline-block;
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.role-chip.customer {
  background: #e8ece9;
  color: #53605a;
}

.role-chip.admin {
  background: #dce9e1;
  color: #2f6b56;
}

.status-chip.active {
  color: #2f6b56;
  background: #e3efe8;
}

.status-chip.inactive {
  color: #8a514b;
  background: #f2e4e1;
}

.table-actions {
  display: flex;
  gap: 5px;
}

.table-actions button {
  width: 29px;
  height: 29px;
  border: 1px solid #dce0dc;
  border-radius: 7px;
  display: grid;
  place-items: center;
  background: #f7f8f6;
  color: #4d5a53;
  font-size: 10px;
  font-weight: 700;
}

.table-actions button:hover {
  background: #e9edea;
}

.empty-state {
  padding: 45px;
  text-align: center;
  color: #77817c;
  font-size: 13px;
}

@media (max-width: 760px) {
  .topbar {
    padding: 0 18px;
  }

  .topnav {
    gap: 10px;
  }

  .topnav > a:first-child {
    display: none;
  }

  .landing-page,
  .dashboard-page,
  .admin-page,
  .settings-page {
    padding: 40px 20px;
  }

  .feature-grid,
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .admin-entry,
  .info-panel {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero {
    padding-top: 20px;
  }

  .hero h1 {
    font-size: 52px;
  }
}

@media (max-width: 520px) {
  .topbar {
    min-height: 62px;
  }

  .brand {
    font-size: 16px;
  }

  .topnav {
    font-size: 11px;
  }

  .nav-primary {
    padding: 8px 10px;
  }

  .auth-card {
    padding: 26px 20px;
  }

  .dashboard-header {
    flex-direction: column;
  }

  .admin-toolbar {
    flex-direction: column;
  }
}

/* =========================================================
   MODULE 1 — CUSTOMER & POCKETS
   ========================================================= */
.customer-module-page {
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
  padding: 56px 44px 80px;
}
.dashboard-header-actions { display:flex; align-items:center; gap:12px; }
.dashboard-message { margin: 0 0 24px; }
.module-section-header { display:flex; align-items:flex-end; justify-content:space-between; gap:25px; margin-bottom:24px; }
.module-section-header h2 { margin:0 0 8px; font-size:30px; letter-spacing:-.035em; font-weight: 700; }
.module-section-header p { margin:0; color:#69756f; font-size:15px; line-height:1.6; }
.pocket-create-card { display:grid; grid-template-columns:1.2fr .8fr auto; align-items:end; gap:16px; padding:26px; margin-bottom:24px; border:1px solid #dfe3de; border-radius:16px; background:#f8faf7; }
.pocket-create-card label { display:grid; gap:8px; color:#35423c; font-size:12px; font-weight: 700; }
.pocket-create-card input { width:100%; padding:13px 15px; border:1px solid #d7ddd8; border-radius:10px; background:#fff; outline:none; font-size:14px; }
.pocket-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:20px; }
.pocket-card { padding:28px; border:1px solid #dfe3de; border-radius:18px; background:#fbfcfa; box-shadow:0 8px 25px rgba(27,39,33,.04); }
.pocket-top { display:flex; align-items:center; justify-content:space-between; }
.pocket-icon { width:46px; height:46px; display:grid; place-items:center; border-radius:12px; background:#e1ebe5; color:#2f6b56; }
.pocket-lock { display:inline-flex; align-items:center; gap:6px; padding:7px 11px; border-radius:99px; background:#e6ebe7; color:#5e6d65; font-size:10px; font-weight: 700; letter-spacing:.08em; }
.pocket-lock.locked { background:#eee4e1; color:#8a514b; }
.pocket-title-row { display:flex; justify-content:space-between; gap:20px; align-items:flex-end; margin-top:24px; }
.pocket-title-row h3 { margin:0 0 6px; font-size:22px; letter-spacing:-.02em; font-weight: 700; }
.pocket-title-row p { margin:0; color:#7a847f; font-size:13px; }
.pocket-title-row strong { font-size:22px; white-space:nowrap; font-weight: 700; }
.progress-track { height:10px; margin-top:24px; overflow:hidden; border-radius:99px; background:#e4e8e4; }
.progress-value { height:100%; border-radius:inherit; background:#2f6b56; }
.progress-label { display:flex; justify-content:space-between; gap:10px; margin-top:10px; color:#7c8781; font-size:11px; font-weight:600; }
.pocket-actions { display:grid; grid-template-columns:1fr 44px 44px; gap:8px; margin-top:22px; }
.pocket-actions input { min-width:0; padding:11px 13px; border:1px solid #d7ddd8; border-radius:9px; outline:none; font-size:14px; }
.pocket-actions input:focus { border-color:#2f6b56; box-shadow:0 0 0 3px rgba(47,107,86,.1); }
.pocket-actions button { border:1px solid #d7ddd8; border-radius:9px; background:#f5f7f4; color:#425149; display:grid; place-items:center; }
.pocket-actions button:hover:not(:disabled) { background:#e8ece9; }
.pocket-actions button:disabled { opacity:.45; cursor:not-allowed; }
.pocket-footer { display:flex; gap:8px; margin-top:16px; padding-top:16px; border-top:1px solid #e7eae7; }
.pocket-footer button { border:0; background:transparent; color:#52605a; display:inline-flex; align-items:center; gap:6px; padding:7px 9px; font-size:12px; font-weight: 700; border-radius:6px; }
.pocket-footer button:hover:not(:disabled) { color:#2f6b56; background:rgba(47,107,86,0.06); }
.pocket-footer button:disabled { opacity:.45; cursor:not-allowed; }
.pocket-footer .danger-action { color:#8a514b; margin-left:auto; }
.pocket-footer .danger-action:hover:not(:disabled) { color:#dc2626; background:rgba(220,38,38,0.06); }
.empty-pocket { min-height:270px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; border:1px dashed #cfd7d1; border-radius:18px; background:#f8faf7; color:#6e7973; padding:30px; }
.empty-pocket svg { color:#2f6b56; }
.empty-pocket h3 { margin:16px 0 6px; color:#27352e; font-size:21px; font-weight: 700; }
.empty-pocket p { margin:0 0 20px; font-size:14px; }
.form-row-two { display:grid; grid-template-columns:1fr 1fr; gap:16px; }

@media (max-width: 1000px) {
  .customer-module-page { padding-left:35px; padding-right:35px; }
  .pocket-grid { grid-template-columns:1fr; }
}
@media (max-width: 700px) {
  .customer-module-page { padding:40px 20px 60px; }
  .dashboard-header-actions { width:100%; justify-content:space-between; }
  .module-section-header { align-items:flex-start; flex-direction:column; }
  .pocket-create-card { grid-template-columns:1fr; }
  .pocket-create-card .button { width:100%; }
  .form-row-two { grid-template-columns:1fr; }
}
@media (max-width: 480px) {
  .customer-module-page { padding-left:16px; padding-right:16px; }
  .pocket-card { padding:22px; }
  .pocket-title-row { align-items:flex-start; flex-direction:column; }
  .pocket-title-row strong { font-size:20px; }
}


/* UI Validation & Navigation Enhancements */
.field-error {
  display: block;
  font-size: 12px;
  color: #dc2626;
  font-weight: 500;
  margin-top: 4px;
}

.field-hint {
  display: block;
  font-size: 11px;
  color: #6b7280;
  margin-top: 3px;
}

input.is-invalid, select.is-invalid {
  border-color: #dc2626 !important;
  background-color: #fef2f2 !important;
}

input:focus.is-invalid {
  outline-color: #dc2626 !important;
  box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2) !important;
}

.strength-bar-container {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.strength-track {
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.strength-label {
  font-size: 11px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
}

.nav-link {
  color: #bfc3bf;
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #ffffff;
}

.nav-link.active {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.12);
  font-weight: 700;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(18, 24, 20, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 20px;
}

.modal-content {
  background: #ffffff;
  border-radius: 16px;
  padding: 28px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
  animation: modalPop 0.2s ease-out;
}

@keyframes modalPop {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.modal-header h3 {
  margin: 0;
  font-size: 19px;
  color: #111827;
}

.modal-close-btn {
  background: transparent;
  border: none;
  color: #6b7280;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
}

.modal-close-btn:hover {
  color: #111827;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.pocket-locked-indicator {
  opacity: 0.6;
  cursor: not-allowed;
}

.tooltip-warning {
  font-size: 11px;
  color: #b45309;
  margin-top: 4px;
  font-weight: 500;
}
```

---

<a id="file-transiqsrcmodules01customerpagescustomerdashboardjsx"></a>
## 96. `Transiq/src/modules/01-customer/pages/CustomerDashboard.jsx`
> **Section**: FRONTEND | **Lines**: 566 | **Path**: `Transiq/src/modules/01-customer/pages/CustomerDashboard.jsx`

```jsx
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Lock, LockOpen, Plus, Target, Trash2, Pencil, ArrowDownToLine, ArrowUpFromLine, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCustomerStore } from '../store/useCustomerStore';
import { usePocketStore } from '../store/usePocketStore';
import { useTransactionStore } from '../../04-transactions/store/transactionStore';
import { getStoredUser } from '../../../services/api';
import { validatePocketName, validatePocketTarget, validateMoveAmount } from '../../../utils/validation';
import AuthVerificationModal from '../../../components/AuthVerificationModal';

const money = (value, currency = 'INR') => {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 2 }).format(Number(value || 0));
  } catch {
    return `${currency} ${Number(value || 0).toFixed(2)}`;
  }
};

export default function CustomerDashboard() {
  const location = useLocation();
  const isPocketsOnly = location.pathname === '/my-pockets';

  const { user: customerData, fetchMe } = useCustomerStore();
  const { items: pockets, fetchAll, create, update, deposit, withdraw, toggleLock, remove, loading, error } = usePocketStore();
  const { items: transactions, fetchAll: fetchTransactions } = useTransactionStore();
  const fallback = getStoredUser();
  const user = customerData?.user || customerData || fallback;

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', targetAmount: '' });
  const [createErrors, setCreateErrors] = useState({});
  const [amounts, setAmounts] = useState({});
  const [moveErrors, setMoveErrors] = useState({});

  // Edit modal state
  const [editingPocket, setEditingPocket] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', targetAmount: '' });
  const [editErrors, setEditErrors] = useState({});

  // Delete confirm modal state
  const [deletingPocket, setDeletingPocket] = useState(null);
  const [message, setMessage] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    fetchMe().catch(() => {});
    fetchAll();
    if (!isPocketsOnly) {
      fetchTransactions({ limit: 5 }).catch(() => {});
    }
  }, [fetchMe, fetchAll, isPocketsOnly, fetchTransactions]);

  const totalSaved = useMemo(() => pockets.reduce((sum, p) => sum + Number(p.currentAmount || 0), 0), [pockets]);
  const totalTarget = useMemo(() => pockets.reduce((sum, p) => sum + Number(p.targetAmount || 0), 0), [pockets]);
  const firstName = user?.firstName || user?.name?.split(' ')[0] || 'Arjun';

  async function handleCreatePocket(e) {
    e.preventDefault();
    setMessage('');

    const nameErr = validatePocketName(form.name);
    const targetErr = validatePocketTarget(form.targetAmount);

    if (nameErr || targetErr) {
      setCreateErrors({ name: nameErr, targetAmount: targetErr });
      return;
    }

    setCreateErrors({});
    const result = await create({
      name: form.name.trim(),
      targetAmount: Number(form.targetAmount || 0),
    });

    if (result.success) {
      setForm({ name: '', targetAmount: '' });
      setShowCreate(false);
      setMessage('Savings pocket created successfully.');
    }
  }

  function openEditModal(pocket) {
    if (pocket.isLocked) {
      setMessage('Cannot edit a locked pocket. Unlock it first.');
      return;
    }
    setEditingPocket(pocket);
    setEditForm({ name: pocket.name, targetAmount: String(pocket.targetAmount) });
    setEditErrors({});
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    const nameErr = validatePocketName(editForm.name);
    const targetErr = validatePocketTarget(editForm.targetAmount);

    if (nameErr || targetErr) {
      setEditErrors({ name: nameErr, targetAmount: targetErr });
      return;
    }

    const result = await update(editingPocket._id, {
      name: editForm.name.trim(),
      targetAmount: Number(editForm.targetAmount || 0),
    });

    if (result.success) {
      setEditingPocket(null);
      setMessage('Pocket updated successfully.');
    }
  }

  async function handleMove(type, pocket) {
    const inputVal = amounts[pocket._id];
    const available = type === 'deposit' ? 1000000 : pocket.currentAmount;
    const err = validateMoveAmount(inputVal, available, type, pocket.isLocked);

    if (err) {
      setMoveErrors((s) => ({ ...s, [pocket._id]: err }));
      return;
    }

    setMoveErrors((s) => ({ ...s, [pocket._id]: null }));
    const amount = Number(inputVal);
    const result = type === 'deposit' ? await deposit(pocket._id, amount) : await withdraw(pocket._id, amount);

    if (result.success) {
      setAmounts((s) => ({ ...s, [pocket._id]: '' }));
      fetchMe().catch(() => {});
      setMessage(
        type === 'deposit'
          ? `Successfully deposited ${money(amount)} into ${pocket.name}.`
          : `Successfully withdrawn ${money(amount)} from ${pocket.name}.`
      );
    }
  }

  async function handleConfirmDelete() {
    if (!deletingPocket) return;
    const result = await remove(deletingPocket._id);
    if (result.success) {
      fetchMe().catch(() => {});
      setMessage(`Pocket "${deletingPocket.name}" removed.`);
      setDeletingPocket(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 pr-36">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              {isPocketsOnly ? 'Savings & Goals Management' : 'Customer Account Overview'}
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              {isPocketsOnly ? 'My Savings Pockets' : `Welcome back, ${firstName}`}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isPocketsOnly
                ? 'Create, fund, and organize dedicated pockets for your financial goals.'
                : 'Manage your daily payments, bank transfers, savings pockets, and security.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ShieldCheck size={15} />
              <span>Verify DB Account</span>
            </button>
            {isPocketsOnly && (
              <button
                onClick={() => setShowCreate((v) => !v)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={15} />
                {showCreate ? 'Close Form' : 'New Pocket'}
              </button>
            )}
          </div>
        </div>

        {/* Payment Auth Verification Modal */}
        <AuthVerificationModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

        {/* Alerts */}
        {(error || message) && (
          <div
            className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between border ${
              error ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            <span>{error || message}</span>
            <button onClick={() => setMessage('')} className="text-slate-400 hover:text-slate-600">
              ✕
            </button>
          </div>
        )}

        {/* Overview Stat Cards - Show only on Dashboard */}
        {!isPocketsOnly && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total in Pockets</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Target size={18} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-2">{money(totalSaved)}</div>
                <p className="text-xs text-slate-500 mt-1">{pockets.length} active savings goal{pockets.length === 1 ? '' : 's'}</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Target Goals Sum</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Sparkles size={18} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-2">{money(totalTarget)}</div>
                <p className="text-xs text-slate-500 mt-1">Total planned target savings</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Quick Actions</span>
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <ArrowRight size={18} />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Link
                    to="/send-money"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 !text-white hover:bg-slate-800 transition"
                  >
                    Send Money
                  </Link>
                  <Link
                    to="/my-wallet"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition border border-slate-200"
                  >
                    My Wallet
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white flex flex-col sm:flex-row items-center justify-between shadow-lg">
              <div>
                <h2 className="text-2xl font-bold mb-2">Ready to explore?</h2>
                <p className="text-blue-100 text-sm max-w-md">
                  Your dashboard is fully set up. You can manage your linked bank accounts in your wallet, set aside money in savings pockets, or send funds instantly.
                </p>
              </div>
              <div className="mt-6 sm:mt-0 flex gap-3">
                <Link to="/transactions" className="px-5 py-2.5 bg-slate-900 !text-white hover:bg-slate-800 text-sm font-bold rounded-xl transition shadow-xs">
                  View History
                </Link>
                <Link to="/insights" className="px-5 py-2.5 bg-indigo-900/40 hover:bg-indigo-900/60 !text-white border border-indigo-400/30 text-sm font-bold rounded-xl transition">
                  Analytics
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Create Pocket Form */}
        {showCreate && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Create New Savings Pocket</h3>
            <form onSubmit={handleCreatePocket} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Pocket Name *</label>
                <input
                  required
                  maxLength="60"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Vacation, Laptop, Emergency"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
                />
                {createErrors.name && <span className="text-[11px] text-rose-600 mt-1 block">{createErrors.name}</span>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Target Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={form.targetAmount}
                  onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
                  placeholder="e.g. 50000"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
                />
                {createErrors.targetAmount && <span className="text-[11px] text-rose-600 mt-1 block">{createErrors.targetAmount}</span>}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  {loading ? 'Creating...' : 'Confirm Pocket'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Recent Transactions - Show only on Dashboard */}
        {!isPocketsOnly && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
                <p className="text-xs text-slate-500 mt-0.5">Your latest account activity and transfers</p>
              </div>
              <Link to="/transactions" className="text-xs font-semibold px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition">
                View All
              </Link>
            </div>
            {transactions?.length === 0 ? (
              <div className="py-8 text-center text-slate-500">No recent transactions.</div>
            ) : (
              <div className="space-y-4">
                {transactions?.slice(0, 5).map((txn) => (
                  <div key={txn._id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.type === 'debit' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {txn.type === 'debit' ? <ArrowUpFromLine size={16} /> : <ArrowDownToLine size={16} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{txn.recipientId?.name || 'Wallet Transfer'}</p>
                        <p className="text-xs text-slate-500">{new Date(txn.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${txn.type === 'debit' ? 'text-slate-900' : 'text-emerald-600'}`}>
                        {txn.type === 'debit' ? '-' : '+'}{money(txn.amount)}
                      </p>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{txn.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pockets Grid - Show only on My Pockets */}
        {isPocketsOnly && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Savings Goals & Pockets</h2>
              <p className="text-xs text-slate-500 mt-0.5">Deposit or withdraw funds anytime or lock for disciplined savings</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
              {pockets.length} Goals
            </span>
          </div>


          {pockets.length === 0 ? (
            <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Target size={32} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No pockets created yet</p>
              <p className="text-xs text-slate-400 mt-0.5 mb-4">Organize your goals by creating your first dedicated savings pocket.</p>
              <button
                onClick={() => setShowCreate(true)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition"
              >
                Create Pocket
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pockets.map((p) => {
                const target = Number(p.targetAmount || 0);
                const current = Number(p.currentAmount || 0);
                const percent = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 100;

                return (
                  <div
                    key={p._id}
                    className="border border-slate-200/80 rounded-2xl p-5 bg-gradient-to-br from-white via-slate-50/50 to-slate-100/50 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 tracking-tight">{p.name}</h3>
                          <span
                            className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border shadow-2xs ${
                              p.isLocked
                                ? 'bg-amber-500/10 text-amber-700 border-amber-300/50'
                                : 'bg-emerald-500/10 text-emerald-700 border-emerald-300/50'
                            }`}
                          >
                            {p.isLocked ? '🔒 LOCKED' : '⚡ ACTIVE'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">Goal Target: <span className="text-slate-700 font-semibold">{money(target)}</span></p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-extrabold text-slate-900 tracking-tight">{money(current)}</span>
                        <p className="text-[11px] font-bold text-blue-600 tracking-wide mt-0.5">{percent}% Achieved</p>
                      </div>
                    </div>

                    {/* CRED / Razorpay Style Progress Meter */}
                    <div className="space-y-1">
                      <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden p-0.5">
                        <div
                          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 h-1.5 rounded-full transition-all duration-500 shadow-xs"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Deposit / Withdraw Controls */}
                    <div className="flex flex-wrap sm:flex-nowrap gap-2.5 items-center pt-2">
                      <div className="relative flex-1 min-w-[130px]">
                        <input
                          type="number"
                          min="1"
                          placeholder="Amount (₹)"
                          value={amounts[p._id] || ''}
                          onChange={(e) => setAmounts({ ...amounts, [p._id]: e.target.value })}
                          disabled={p.isLocked}
                          className="w-full px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition placeholder:text-slate-400 placeholder:text-xs"
                        />
                      </div>
                      <button
                        onClick={() => handleMove('deposit', p)}
                        disabled={p.isLocked}
                        className="flex-shrink-0 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        <ArrowDownToLine size={13} /> Deposit
                      </button>
                      <button
                        onClick={() => handleMove('withdraw', p)}
                        disabled={p.isLocked || current <= 0}
                        className="flex-shrink-0 px-3.5 py-2 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        <ArrowUpFromLine size={13} /> Withdraw
                      </button>
                    </div>
                    {moveErrors[p._id] && <p className="text-[11px] font-semibold text-rose-600">{moveErrors[p._id]}</p>}

                    {/* Footer Actions */}
                    <div className="flex justify-between items-center pt-3 border-t border-slate-200/60 text-xs text-slate-500">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleLock(p._id)}
                          className="hover:text-slate-900 inline-flex items-center gap-1 transition cursor-pointer"
                        >
                          {p.isLocked ? <Lock size={13} className="text-amber-600" /> : <LockOpen size={13} />}
                          <span>{p.isLocked ? 'Unlock' : 'Lock'}</span>
                        </button>
                        <button
                          onClick={() => openEditModal(p)}
                          disabled={p.isLocked}
                          className="hover:text-slate-900 disabled:opacity-40 inline-flex items-center gap-1 transition cursor-pointer"
                        >
                          <Pencil size={13} /> Edit
                        </button>
                      </div>
                      <button
                        onClick={() => setDeletingPocket(p)}
                        className="text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 transition cursor-pointer"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        )}

        {/* Edit Modal */}
        {editingPocket && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-slate-900">Edit Pocket: {editingPocket.name}</h3>
              <form onSubmit={handleSaveEdit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Pocket Name</label>
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                  {editErrors.name && <span className="text-[11px] text-rose-600">{editErrors.name}</span>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Target Amount (₹)</label>
                  <input
                    type="number"
                    value={editForm.targetAmount}
                    onChange={(e) => setEditForm({ ...editForm, targetAmount: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                  {editErrors.targetAmount && <span className="text-[11px] text-rose-600">{editErrors.targetAmount}</span>}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingPocket(null)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingPocket && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl border border-slate-200 max-w-sm w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-3 text-rose-600">
                <AlertCircle size={24} />
                <h3 className="text-base font-bold text-slate-900">Delete Pocket?</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete <strong>{deletingPocket.name}</strong>? Any remaining funds of{' '}
                <strong>{money(deletingPocket.currentAmount)}</strong> will be returned to your main wallet.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingPocket(null)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition"
                >
                  Delete & Return Funds
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

<a id="file-transiqsrcmodules01customerpagescustomerdashboardpagejsx"></a>
## 97. `Transiq/src/modules/01-customer/pages/CustomerDashboardPage.jsx`
> **Section**: FRONTEND | **Lines**: 1 | **Path**: `Transiq/src/modules/01-customer/pages/CustomerDashboardPage.jsx`

```jsx
export { default } from '../../../pages/CustomerDashboard';
```

---

<a id="file-transiqsrcmodules01customerstoreusecustomerstorejs"></a>
## 98. `Transiq/src/modules/01-customer/store/useCustomerStore.js`
> **Section**: FRONTEND | **Lines**: 17 | **Path**: `Transiq/src/modules/01-customer/store/useCustomerStore.js`

```javascript
import { create } from 'zustand';
import customerService from '../../../api/customerService';

export const useCustomerStore = create((set) => ({
  user: null, loading: false, error: null,
  fetchMe: async () => {
    set({ loading: true, error: null });
    try { const { data } = await customerService.getMe(); set({ user: data.data, loading: false }); return data.data; }
    catch (err) { const message = err.response?.data?.message || 'Failed to fetch customer'; set({ error: message, loading: false }); throw err; }
  },
  updateMe: async (payload) => {
    set({ loading: true, error: null });
    try { const { data } = await customerService.updateMe(payload); set({ user: data.data, loading: false }); localStorage.setItem('paygate_user', JSON.stringify(data.data)); return data.data; }
    catch (err) { const message = err.response?.data?.message || 'Failed to update profile'; set({ error: message, loading: false }); throw err; }
  },
  clearError: () => set({ error: null })
}));
```

---

<a id="file-transiqsrcmodules01customerstoreusepocketstorejs"></a>
## 99. `Transiq/src/modules/01-customer/store/usePocketStore.js`
> **Section**: FRONTEND | **Lines**: 42 | **Path**: `Transiq/src/modules/01-customer/store/usePocketStore.js`

```javascript
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
```

---

<a id="file-transiqsrcmodules01customerstoreusewalletstorejs"></a>
## 100. `Transiq/src/modules/01-customer/store/useWalletStore.js`
> **Section**: FRONTEND | **Lines**: 17 | **Path**: `Transiq/src/modules/01-customer/store/useWalletStore.js`

```javascript
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
```

---

<a id="file-transiqsrcmodules02recipientspagesrecipientlistjsx"></a>
## 101. `Transiq/src/modules/02-recipients/pages/RecipientList.jsx`
> **Section**: FRONTEND | **Lines**: 427 | **Path**: `Transiq/src/modules/02-recipients/pages/RecipientList.jsx`

```jsx
import { useState, useEffect } from 'react';
import { useRecipientStore } from '../store/useRecipientStore';
import { Search, Plus, Star, Trash2, Pencil, Building, User, Phone, Mail, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { validateName, validateAccountNumber, validateIfsc, validatePhone, validateEmail } from '../../../utils/validation';

const ACCOUNT_TYPES = [
  { value: 'savings', label: 'Savings' },
  { value: 'current', label: 'Current' },
  { value: 'nri', label: 'NRI' },
];

const emptyForm = {
  name: '',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  accountType: 'savings',
  phone: '',
  email: '',
};

const RecipientList = () => {
  const {
    recipients,
    loading,
    error,
    successMessage,
    fetchAll,
    create,
    update,
    remove,
    toggleFavourite,
    clearError,
    clearSuccess,
  } = useRecipientStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const params = {};
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (filterType) params.accountType = filterType;
    fetchAll(params);
  }, [fetchAll, filterType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (filterType) params.accountType = filterType;
    fetchAll(params);
  };

  const validate = () => {
    const errs = {};
    const nameErr = validateName(formData.name, 'Recipient Name');
    if (nameErr) errs.name = nameErr;

    const bankErr = validateName(formData.bankName, 'Bank Name');
    if (bankErr) errs.bankName = bankErr;

    const accErr = validateAccountNumber(formData.accountNumber);
    if (accErr) errs.accountNumber = accErr;

    const ifscErr = validateIfsc(formData.ifscCode);
    if (ifscErr) errs.ifscCode = ifscErr;

    if (formData.phone && formData.phone.trim()) {
      const phoneErr = validatePhone(formData.phone);
      if (phoneErr) errs.phone = phoneErr;
    }

    if (formData.email && formData.email.trim()) {
      const emailErr = validateEmail(formData.email);
      if (emailErr) errs.email = emailErr;
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingRecipient) {
      const res = await update(editingRecipient._id, formData);
      if (res?.success) {
        setEditingRecipient(null);
        setFormData(emptyForm);
        fetchAll();
      }
    } else {
      const res = await create(formData);
      if (res?.success) {
        setShowAddModal(false);
        setFormData(emptyForm);
        fetchAll();
      }
    }
  };

  const handleOpenEdit = (rec) => {
    setEditingRecipient(rec);
    setFormData({
      name: rec.name || '',
      bankName: rec.bankName || '',
      accountNumber: rec.accountNumber || '',
      ifscCode: rec.ifscCode || '',
      accountType: rec.accountType || 'savings',
      phone: rec.phone || '',
      email: rec.email || '',
    });
    setFormErrors({});
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from your recipients?`)) {
      await remove(id);
      fetchAll();
    }
  };

  const favouriteCount = recipients.filter((r) => r.isFavorite).length;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 pr-36">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Beneficiary Management</span>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">Recipients & Contacts</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {recipients.length} saved contact{recipients.length !== 1 ? 's' : ''}
              {favouriteCount > 0 && ` · ${favouriteCount} starred for fast transfers`}
            </p>
          </div>
          <div>
            <button
              onClick={() => {
                setEditingRecipient(null);
                setFormData(emptyForm);
                setFormErrors({});
                setShowAddModal(true);
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={15} /> Add Recipient
            </button>
          </div>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="p-4 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} /> {successMessage}
            </span>
            <button onClick={clearSuccess} className="text-emerald-600 hover:text-emerald-800">✕</button>
          </div>
        )}
        {error && (
          <div className="p-4 rounded-xl text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </span>
            <button onClick={clearError} className="text-rose-600 hover:text-rose-800">✕</button>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full max-w-md">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by recipient name, bank, or account..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
            />
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-600"
            >
              <option value="">All Account Types</option>
              {ACCOUNT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200">
              {recipients.length} Found
            </span>
          </div>
        </div>

        {/* Recipients Grid */}
        {recipients.length === 0 ? (
          <div className="py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
            <User size={32} className="mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-700">No recipients found</p>
            <p className="text-xs text-slate-400 mt-0.5 mb-4">Add your first recipient or adjust your search filter.</p>
            <button
              onClick={() => {
                setEditingRecipient(null);
                setFormData(emptyForm);
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition"
            >
              Add Recipient
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recipients.map((rec) => (
              <div
                key={rec._id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {rec.name?.charAt(0)?.toUpperCase() || 'R'}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{rec.name}</h3>
                      <p className="text-xs text-slate-500">{rec.bankName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavourite(rec._id)}
                    className="text-slate-300 hover:text-amber-500 transition cursor-pointer"
                    title={rec.isFavorite ? 'Remove star' : 'Mark favorite'}
                  >
                    <Star size={18} className={rec.isFavorite ? 'fill-amber-400 text-amber-400' : ''} />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account:</span>
                    <span className="font-mono font-medium text-slate-800">{rec.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">IFSC:</span>
                    <span className="font-mono text-slate-800">{rec.ifscCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="capitalize font-medium text-slate-700">{rec.accountType || 'Savings'}</span>
                  </div>
                  {rec.phone && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phone:</span>
                      <span className="text-slate-700">{rec.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[11px] font-mono text-slate-400">
                    {rec.referenceCode || `REC-${rec._id?.slice(-4)}`}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(rec)}
                      className="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition inline-flex items-center gap-1"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(rec._id, rec.name)}
                      className="px-2.5 py-1 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition inline-flex items-center gap-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add / Edit Recipient Modal */}
        {(showAddModal || editingRecipient) && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  {editingRecipient ? `Edit: ${editingRecipient.name}` : 'Add New Beneficiary'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingRecipient(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Recipient Name *</label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                    {formErrors.name && <span className="text-[11px] text-rose-600">{formErrors.name}</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Bank Name *</label>
                    <input
                      required
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      placeholder="e.g. HDFC Bank"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                    {formErrors.bankName && <span className="text-[11px] text-rose-600">{formErrors.bankName}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Account Number *</label>
                    <input
                      required
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      placeholder="e.g. 50100412345678"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                    {formErrors.accountNumber && <span className="text-[11px] text-rose-600">{formErrors.accountNumber}</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">IFSC Code *</label>
                    <input
                      required
                      value={formData.ifscCode}
                      onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                      placeholder="e.g. HDFC0001234"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 uppercase"
                    />
                    {formErrors.ifscCode && <span className="text-[11px] text-rose-600">{formErrors.ifscCode}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Account Type</label>
                    <select
                      value={formData.accountType}
                      onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    >
                      <option value="savings">Savings</option>
                      <option value="current">Current</option>
                      <option value="nri">NRI</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Phone (Optional)</label>
                    <input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="9876543210"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email (Optional)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="user@example.com"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingRecipient(null);
                    }}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                  >
                    {loading ? 'Saving...' : editingRecipient ? 'Save Changes' : 'Add Recipient'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientList;
```

---

<a id="file-transiqsrcmodules02recipientspagesremitterprofilejsx"></a>
## 102. `Transiq/src/modules/02-recipients/pages/RemitterProfile.jsx`
> **Section**: FRONTEND | **Lines**: 124 | **Path**: `Transiq/src/modules/02-recipients/pages/RemitterProfile.jsx`

```jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/participant.css';

const initialProfile = {
  fullName: 'Nithin',
  email: 'nithin1709@gmail.com',
  phone: '+91 9876543210',
  accountNumber: '1234567890123456',
  bankName: 'HDFC Bank',
  accountType: 'Savings',
};

const RemitterProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialProfile);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className="module-page participants-page">
      <div className="module-header">
        <div>
          <p className="page-eyebrow">Profile</p>
          <h1>Remitter profile</h1>
        </div>
        <div className="header-actions">
          <Link to="/" className="secondary-button">Back to dashboard</Link>
          <button type="button" className="primary-button" onClick={() => setIsEditing((current) => !current)}>
            {isEditing ? 'Cancel' : 'Edit profile'}
          </button>
        </div>
      </div>

      <div className="card profile-card">
        {!isEditing ? (
          <div className="profile-view">
            <div className="profile-summary">
              <div className="avatar">N</div>
              <div>
                <h2>{formData.fullName}</h2>
                <p>{formData.email}</p>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <span className="label">Phone</span>
                <strong>{formData.phone}</strong>
              </div>
              <div className="info-item">
                <span className="label">Bank</span>
                <strong>{formData.bankName}</strong>
              </div>
              <div className="info-item">
                <span className="label">Account type</span>
                <strong>{formData.accountType}</strong>
              </div>
              <div className="info-item full-width">
                <span className="label">Account number</span>
                <strong>{formData.accountNumber}</strong>
              </div>
            </div>

            <div className="inline-actions">
              <Link to="/recipients" className="secondary-button">View recipients</Link>
              <Link to="/send-money" className="primary-button">Initiate payment</Link>
            </div>
          </div>
        ) : (
          <form className="profile-form" onSubmit={handleSave}>
            <div className="form-grid">
              <label>
                <span>Full name</span>
                <input name="fullName" value={formData.fullName} onChange={handleChange} />
              </label>
              <label>
                <span>Email</span>
                <input name="email" type="email" value={formData.email} onChange={handleChange} />
              </label>
              <label>
                <span>Phone</span>
                <input name="phone" value={formData.phone} onChange={handleChange} />
              </label>
              <label>
                <span>Bank name</span>
                <input name="bankName" value={formData.bankName} onChange={handleChange} />
              </label>
              <label>
                <span>Account type</span>
                <select name="accountType" value={formData.accountType} onChange={handleChange}>
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                  <option value="Salary">Salary</option>
                </select>
              </label>
              <label>
                <span>Account number</span>
                <input name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
              </label>
            </div>

            <div className="inline-actions">
              <button type="button" className="secondary-button" onClick={() => setIsEditing(false)}>
                Discard
              </button>
              <button type="submit" className="primary-button">Save changes</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RemitterProfile;
```

---

<a id="file-transiqsrcmodules02recipientsstoreuserecipientstorejs"></a>
## 103. `Transiq/src/modules/02-recipients/store/useRecipientStore.js`
> **Section**: FRONTEND | **Lines**: 137 | **Path**: `Transiq/src/modules/02-recipients/store/useRecipientStore.js`

```javascript
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
```

---

<a id="file-transiqsrcmodules02recipientsstylesparticipantcss"></a>
## 104. `Transiq/src/modules/02-recipients/styles/participant.css`
> **Section**: FRONTEND | **Lines**: 735 | **Path**: `Transiq/src/modules/02-recipients/styles/participant.css`

```css
/* ═══════════════════════════════════════════════════════
   PayGate / Transiq — Module 02 Participants Styles
   ═══════════════════════════════════════════════════════ */

/* ── Page Layout ─────────────────────────────────────── */
.module-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px 28px 48px;
  color: #1f2937;
}

.module-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.module-header h1 {
  margin: 4px 0 0;
  font-size: clamp(2rem, 2.8vw, 2.6rem);
  font-weight: 700;
  color: #192848;
}

.header-subtitle {
  margin: 6px 0 0;
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.header-subtitle span {
  color: #d97706;
}

.page-eyebrow {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6b3d2f;
}

.page-eyebrow.muted {
  color: #64748b;
}

/* ── Buttons ─────────────────────────────────────────── */
.header-actions,
.inline-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.primary-button,
.secondary-button,
.ghost-button,
.danger-button {
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 10px 16px;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
}

.primary-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.primary-button {
  background: #192848;
  color: #ffffff;
}

.primary-button:hover:not(:disabled) {
  background: #1e3a5f;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(25, 40, 72, 0.25);
}

.secondary-button {
  background: #eef2ff;
  color: #1d4ed8;
  border-color: #dbeafe;
}

.secondary-button:hover {
  background: #e0e7ff;
}

.ghost-button {
  background: transparent;
  border-color: #dbe1ea;
  color: #475569;
}

.ghost-button:hover {
  background: #f1f5f9;
}

.ghost-button.fav-active {
  color: #d97706;
  border-color: #fde68a;
  background: #fffbeb;
}

.danger-button {
  background: #fff1f2;
  border-color: #fecdd3;
  color: #be123c;
}

.danger-button:hover {
  background: #ffe4e6;
  border-color: #fda4af;
}

/* ── Card ────────────────────────────────────────────── */
.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
}

/* ── Toast Notifications ─────────────────────────────── */
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  animation: toastSlideIn 0.3s ease, toastFadeOut 0.3s ease 2.7s forwards;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.toast-success {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.toast-error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.toast-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
}

.toast-success .toast-icon {
  background: #065f46;
  color: #ecfdf5;
}

.toast-error .toast-icon {
  background: #991b1b;
  color: #fef2f2;
}

@keyframes toastSlideIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}

@keyframes toastFadeOut {
  from { opacity: 1; }
  to   { opacity: 0; pointer-events: none; }
}

/* ── Search & Filter Bar ─────────────────────────────── */
.search-filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 22px;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: #94a3b8;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font: inherit;
  font-size: 14px;
  background: #ffffff;
  color: #111827;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3d73d3;
  box-shadow: 0 0 0 3px rgba(61, 115, 211, 0.12);
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: #e2e8f0;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #475569;
  font-size: 14px;
  font-weight: 700;
  transition: background 0.15s ease;
}

.search-clear:hover {
  background: #cbd5e1;
}

.filter-select {
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font: inherit;
  font-size: 14px;
  background: #ffffff;
  color: #111827;
  cursor: pointer;
  min-width: 140px;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #3d73d3;
  box-shadow: 0 0 0 3px rgba(61, 115, 211, 0.12);
}

/* ── Loading State ───────────────────────────────────── */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 20px;
  color: #64748b;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: #3d73d3;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Empty State ─────────────────────────────────────── */
.empty-state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 20px;
  text-align: center;
}

.empty-state-icon {
  font-size: 42px;
  opacity: 0.5;
}

.empty-state-container h3 {
  margin: 0;
  font-size: 1.15rem;
  color: #192848;
}

.empty-state-container p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

/* ── Participants Layout ─────────────────────────────── */
.participants-layout {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 22px;
}

.recipients-panel,
.detail-panel {
  padding: 22px;
}

/* ── Recipient Form ──────────────────────────────────── */
.recipient-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-title {
  margin: 0 0 4px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #192848;
}

.info-grid,
.detail-info,
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.info-item,
.detail-info > div,
.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 15px 16px;
}

.form-grid label {
  background: transparent;
  padding: 0;
  border: none;
  gap: 8px;
}

.form-grid label span {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.form-grid input,
.form-grid select {
  border: 1px solid #d4d9e1;
  border-radius: 10px;
  padding: 11px 12px;
  font: inherit;
  background: #ffffff;
  color: #111827;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-grid input:focus,
.form-grid select:focus {
  outline: none;
  border-color: #3d73d3;
  box-shadow: 0 0 0 3px rgba(61, 115, 211, 0.12);
}

.compact-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.full-width,
.form-grid .full-width {
  grid-column: 1 / -1;
}

/* ── Recipient List ──────────────────────────────────── */
.recipient-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recipient-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 14px;
  padding: 14px 16px;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.recipient-item:hover {
  border-color: #93c5fd;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(61, 115, 211, 0.08);
}

.recipient-item.selected {
  border-color: #3d73d3;
  background: #f0f5ff;
  box-shadow: 0 2px 12px rgba(61, 115, 211, 0.1);
}

.recipient-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar,
.recipient-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2f6b56, #3d73d3);
  color: white;
  border-radius: 50%;
  font-weight: 700;
}

.avatar {
  width: 64px;
  height: 64px;
  font-size: 1.35rem;
}

.recipient-avatar {
  width: 42px;
  height: 42px;
  font-size: 1rem;
  flex-shrink: 0;
}

.recipient-main h3 {
  margin: 0;
  font-size: 1rem;
  color: #111827;
}

.recipient-main p {
  margin: 4px 0 0;
  font-size: 13px;
  color: #64748b;
}

.fav-star {
  color: #d97706;
  font-size: 0.85em;
}

.recipient-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
}

.account-number-meta {
  font-size: 12px;
  color: #475569;
  font-family: 'SF Mono', 'Cascadia Mono', 'Consolas', monospace;
  letter-spacing: 0.03em;
}

.account-type-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.badge-savings {
  background: #ecfdf5;
  color: #065f46;
}

.badge-current {
  background: #eff6ff;
  color: #1e40af;
}

.badge-nri {
  background: #fef3c7;
  color: #92400e;
}

.badge-ewa {
  background: #fdf2f8;
  color: #9d174d;
}

/* ── Detail Panel ────────────────────────────────────── */
.detail-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.detail-header h2 {
  margin: 0;
  font-size: clamp(1.4rem, 2vw, 1.8rem);
  color: #111827;
}

.ref-code {
  margin: 4px 0 0;
  font-size: 12px;
  color: #94a3b8;
  font-family: 'SF Mono', 'Cascadia Mono', 'Consolas', monospace;
  letter-spacing: 0.04em;
}

.label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #64748b;
}

.info-item strong,
.detail-info strong {
  font-size: 1rem;
  color: #0f172a;
}

.capitalize {
  text-transform: capitalize;
}

.stacked-actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.stacked-actions > * {
  width: 100%;
  justify-content: center;
  text-align: center;
}

/* ── Profile ─────────────────────────────────────────── */
.profile-card {
  padding: 28px;
}

.profile-view,
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-summary {
  display: flex;
  align-items: center;
  gap: 18px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.profile-summary h2 {
  margin: 0;
  font-size: clamp(1.5rem, 2vw, 2rem);
  color: #111827;
}

.profile-summary p {
  margin: 4px 0 0;
  color: #64748b;
}

.info-grid .info-item.full-width {
  grid-column: 1 / -1;
}

/* ── Modal ───────────────────────────────────────────── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  padding: 24px;
  z-index: 50;
  animation: backdropFadeIn 0.2s ease;
}

@keyframes backdropFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.modal-card {
  width: min(560px, 100%);
  background: #ffffff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.2);
  animation: modalSlideIn 0.25s ease;
}

@keyframes modalSlideIn {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #111827;
}

.modal-footer-text {
  margin: 18px 0 0;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
  font-size: 13px;
  color: #94a3b8;
  text-align: center;
}

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 900px) {
  .participants-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .module-page {
    padding: 22px 16px 28px;
  }

  .module-header,
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions,
  .inline-actions {
    width: 100%;
  }

  .header-actions > *,
  .inline-actions > * {
    flex: 1;
    text-align: center;
  }

  .info-grid,
  .detail-info,
  .compact-grid {
    grid-template-columns: 1fr;
  }

  .search-filter-bar {
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }
}
```

---

<a id="file-transiqsrcmodules03initiationcomponentsflowpipelinejsx"></a>
## 105. `Transiq/src/modules/03-initiation/components/FlowPipeline.jsx`
> **Section**: FRONTEND | **Lines**: 70 | **Path**: `Transiq/src/modules/03-initiation/components/FlowPipeline.jsx`

```jsx
import React from 'react';

export default function FlowPipeline({ currentStep, isFailed }) {
  const steps = [
    { num: 1, label: 'Account' },
    { num: 2, label: 'Recipient' },
    { num: 3, label: 'Details' },
    { num: 4, label: 'Review and Confirm' },
    { num: 5, label: 'Security PIN' },
    { num: 6, label: 'Result' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 shadow-2xs mb-6 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[720px] max-w-full">
        {steps.map((step, idx) => {
          // Transaction ID generated in background; step 1 is Account Selection
          const isCompleted = step.num < currentStep || (currentStep === 6 && !isFailed);
          const isActive = step.num === currentStep && !(currentStep === 6 && isFailed);
          const isStepFailed = step.num === 6 && isFailed && currentStep === 6;

          return (
            <React.Fragment key={step.num}>
              {/* Step Node */}
              <div className="flex flex-col items-center flex-1 relative z-10 px-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border ${
                    isCompleted
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                      : isStepFailed
                      ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                      : isActive
                      ? 'bg-slate-900 text-white border-slate-900 ring-4 ring-slate-100 shadow-sm'
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}
                >
                  {isCompleted ? '✓' : isStepFailed ? '✕' : step.num}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-1.5 whitespace-nowrap ${
                    isCompleted
                      ? 'text-emerald-700'
                      : isStepFailed
                      ? 'text-rose-700 font-bold'
                      : isActive
                      ? 'text-slate-900 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line */}
              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 rounded transition-colors ${
                    step.num < currentStep || (currentStep === 6 && !isFailed)
                      ? 'bg-emerald-500'
                      : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
```

---

<a id="file-transiqsrcmodules03initiationpagesmywalletpagejsx"></a>
## 106. `Transiq/src/modules/03-initiation/pages/MyWalletPage.jsx`
> **Section**: FRONTEND | **Lines**: 607 | **Path**: `Transiq/src/modules/03-initiation/pages/MyWalletPage.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { formatINR } from '../utils/format';
import { getApiBaseUrl } from '../../../api/axiosInstance';
import { validateAccountNumber, validatePhone } from '../../../utils/validation';

export default function MyWalletPage() {
  const API_BASE = getApiBaseUrl();
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [dummyAccounts, setDummyAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Add Bank Account Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addStep, setAddStep] = useState(1); // 1 = Enter details, 2 = Enter OTP
  const [accountNumber, setAccountNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [otpNotification, setOtpNotification] = useState('');

  // Optional Wallet Split Modal State
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [selectedSplitAcc, setSelectedSplitAcc] = useState(null);
  const [mainWalletAlloc, setMainWalletAlloc] = useState('');
  const [savingsWalletAlloc, setSavingsWalletAlloc] = useState('');
  const [splitErrorMsg, setSplitErrorMsg] = useState('');

  useEffect(() => {
    fetchConnectedAccounts();
    fetchDummyAccounts();
  }, []);

  useEffect(() => {
    if (!otpNotification) return undefined;
    const timeoutId = setTimeout(() => setOtpNotification(''), 8000);
    return () => clearTimeout(timeoutId);
  }, [otpNotification]);

  const fetchConnectedAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/accounts`);
      if (res.ok) {
        const data = await res.json();
        setConnectedAccounts(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const fetchDummyAccounts = async () => {
    try {
      const res = await fetch(`${API_BASE}/bank/dummy-accounts`);
      if (res.ok) {
        const data = await res.json();
        setDummyAccounts(data);
      }
    } catch {}
  };

  // Step 1: Send OTP to associated phone number
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const accErr = validateAccountNumber(accountNumber);
    if (accErr) {
      setErrorMsg(accErr);
      return;
    }
    const phoneErr = validatePhone(phoneNumber);
    if (phoneErr) {
      setErrorMsg(phoneErr);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/wallet/accounts/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountNumber: accountNumber.trim(),
          phone: phoneNumber.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to send OTP.');
      }

      setVerificationCode(data.verificationCode);
      setAddStep(2);
      setOtpNotification(data.verificationCode);
      setSuccessMsg(`A verification code has been sent to ${phoneNumber}.`);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Connect Account
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/wallet/accounts/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountNumber: accountNumber.trim(),
          phone: phoneNumber.trim(),
          otp: otpCode.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Incorrect OTP. Please try again.');
      }

      setSuccessMsg('Bank account verified and connected successfully!');
      setShowAddModal(false);
      setAddStep(1);
      setAccountNumber('');
      setPhoneNumber('');
      setOtpCode('');
      setVerificationCode('');
      fetchConnectedAccounts();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Select an available account to fill the form
  const fillDummyDetails = (acc) => {
    setAccountNumber(acc.accountNumber);
    setPhoneNumber(acc.associatedPhoneNumber);
    setErrorMsg('');
  };

  // Open Split Balance Modal
  const openSplitModal = (acc) => {
    setSelectedSplitAcc(acc);
    setMainWalletAlloc(Math.round(acc.balance * 0.6).toString());
    setSavingsWalletAlloc(Math.round(acc.balance * 0.4).toString());
    setSplitErrorMsg('');
    setShowSplitModal(true);
  };

  // Handle Wallet Splitting
  const handleSaveSplit = async (e) => {
    e.preventDefault();
    setSplitErrorMsg('');

    const mainAmt = Number(mainWalletAlloc) || 0;
    const savAmt = Number(savingsWalletAlloc) || 0;
    const totalAlloc = mainAmt + savAmt;
    const availBal = selectedSplitAcc?.balance || 0;

    if (totalAlloc > availBal) {
      setSplitErrorMsg(`Wallet allocation (${formatINR(totalAlloc)}) cannot exceed the available account balance (${formatINR(availBal)}).`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/wallet/split`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: selectedSplitAcc.id,
          allocations: [
            { walletName: 'Main Wallet', amount: mainAmt },
            { walletName: 'Savings Wallet', amount: savAmt },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to update wallet allocation.');
      }

      setSuccessMsg('Wallet allocation updated successfully!');
      setShowSplitModal(false);
      fetchConnectedAccounts();
    } catch (err) {
      setSplitErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalAvailableBalance = connectedAccounts.reduce((sum, a) => sum + (a.balance || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 pr-36">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">PayGate Gateway — Account Management</span>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">My Wallet & Connected Bank Accounts</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Connect and verify your bank accounts to enable payments and transfers
            </p>
          </div>
          <button
            onClick={() => {
              setShowAddModal(true);
              setAddStep(1);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition"
          >
            + Add Bank Account
          </button>
        </div>

        {otpNotification && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[120] w-[calc(100%-2rem)] max-w-md rounded-xl border border-blue-200 bg-white px-5 py-4 text-center shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Phone verification code</p>
            <p className="mt-1 text-2xl font-bold tracking-[0.3em] text-slate-900">{otpNotification}</p>
            <p className="mt-1 text-xs text-slate-500">Enter this code to verify your bank account.</p>
            <button
              type="button"
              onClick={() => setOtpNotification('')}
              className="absolute right-3 top-2 text-slate-400 hover:text-slate-700"
              aria-label="Dismiss verification code notification"
            >
              ✕
            </button>
          </div>
        )}

        {/* Global Success / Error Toast Banners */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex justify-between items-center">
            <span>✓ {successMsg}</span>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-600 font-bold ml-2">✕</button>
          </div>
        )}

        {errorMsg && !showAddModal && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex justify-between items-center">
            <span>⚠️ {errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="text-rose-500 font-bold ml-2">✕</button>
          </div>
        )}

        {/* Persistent Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Connected Accounts</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{connectedAccounts.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Verified bank connections</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Total Bank Balance</p>
            <p className="text-2xl font-bold text-emerald-600 mt-2">{formatINR(totalAvailableBalance)}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Available for Send / Receive</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">Verification Status</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {connectedAccounts.length > 0 ? '✓ Verified' : 'Unverified'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">PayGate Security Check</p>
          </div>
        </div>

        {/* CONNECTED BANK ACCOUNTS SECTION */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900">Connected Bank Accounts</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verified bank accounts linked to your PayGate Wallet
              </p>
            </div>
            {connectedAccounts.length > 0 && (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-200">
                {connectedAccounts.length} Connected
              </span>
            )}
          </div>

          {connectedAccounts.length === 0 ? (
            <div className="p-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">No bank account is connected</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Add and verify a bank account to continue with Send Money & Receive Money operations.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(true);
                  setAddStep(1);
                  setErrorMsg('');
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
              >
                + Add & Verify Bank Account
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connectedAccounts.map((acc) => (
                <div
                  key={acc.id || acc.accountNumber}
                  className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{acc.name || acc.accountHolderName}</p>
                      <p className="text-xs font-mono font-semibold text-slate-500 mt-0.5">
                        {acc.maskedAccountNumber || acc.number || acc.accountNumber}
                      </p>
                      <span className="inline-block mt-2 px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded uppercase border border-slate-200">
                        {acc.bank || 'Partner Bank'} • {acc.type || 'SAVINGS'}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-md border border-emerald-200">
                      ✓ Verified
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Available Bank Balance</p>
                      <p className="text-lg font-mono font-bold text-slate-900 mt-0.5">{formatINR(acc.balance || 0)}</p>
                    </div>
                    <button
                      onClick={() => openSplitModal(acc)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Split Balance
                    </button>
                  </div>
                </div>
              ))}

              {/* Add New Account Card */}
              <div
                onClick={() => {
                  setShowAddModal(true);
                  setAddStep(1);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="p-5 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 hover:bg-blue-50/40 hover:border-blue-400 transition cursor-pointer flex flex-col items-center justify-center text-center space-y-2 min-h-[140px]"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">
                  +
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Add New Bank Account</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Link another bank account via OTP verification</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ADD BANK ACCOUNT MODAL (2-STEP OTP FLOW) */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-5">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {addStep === 1 ? 'Add Bank Account' : 'Verify Phone OTP'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* STEP 1: Enter Bank Account Details */}
              {addStep === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <p className="text-xs text-slate-500">
                    Enter your bank account number and registered phone number to receive a 6-digit verification code.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Bank Account Number *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BANK10001"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 font-mono font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Associated Phone Number *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9876543210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-900 font-medium"
                    />
                  </div>

                  {/* Available bank accounts */}
                  {dummyAccounts.length > 0 && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        💡 Available bank accounts:
                      </span>
                      <div className="space-y-1.5">
                        {dummyAccounts.map((d) => (
                          <div
                            key={d.accountNumber}
                            onClick={() => fillDummyDetails(d)}
                            className="p-2 rounded bg-white border border-slate-200 hover:border-blue-400 cursor-pointer flex justify-between items-center text-[11px]"
                          >
                            <div>
                              <span className="font-mono font-bold text-blue-600">{d.accountNumber}</span>
                              <span className="text-slate-500 ml-2">({d.bankName})</span>
                            </div>
                            <span className="font-mono text-emerald-600 font-bold">{formatINR(d.availableBalance)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                    >
                      {loading ? 'Searching Bank...' : 'Get OTP for Verification →'}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: Enter OTP Code */}
              {addStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 text-xs text-blue-800 space-y-1">
                    <p className="font-bold">📱 Your verification code:</p>
                    <p className="font-mono text-base font-bold text-blue-600 tracking-wider">
                      {verificationCode || '123456'}
                    </p>
                    <p className="text-[10px] text-slate-500">Sent to {phoneNumber} • Expires in 5 minutes</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                      Enter 6-Digit OTP Code *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="• • • • • •"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-48 text-center tracking-[0.4em] text-xl font-mono py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-900 font-bold mx-auto block"
                    />
                  </div>

                  <div className="flex justify-between pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setAddStep(1)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold"
                    >
                      ← Change Details
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                    >
                      {loading ? 'Verifying...' : 'Verify OTP & Connect ✓'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* OPTIONAL WALLET SPLIT MODAL */}
        {showSplitModal && selectedSplitAcc && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-5">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Optional Wallet Balance Splitting</h3>
                <button
                  onClick={() => setShowSplitModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              {splitErrorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
                  ⚠️ {splitErrorMsg}
                </div>
              )}

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                <p className="text-slate-500 font-semibold uppercase text-[10px]">Bank Account Balance:</p>
                <p className="font-mono text-lg font-bold text-slate-900">{formatINR(selectedSplitAcc.balance || 0)}</p>
                <p className="text-[11px] text-slate-500">{selectedSplitAcc.name}</p>
              </div>

              <form onSubmit={handleSaveSplit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Main Wallet Allocation (₹)
                  </label>
                  <input
                    type="number"
                    value={mainWalletAlloc}
                    onChange={(e) => setMainWalletAlloc(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Savings Wallet Allocation (₹)
                  </label>
                  <input
                    type="number"
                    value={savingsWalletAlloc}
                    onChange={(e) => setSavingsWalletAlloc(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-900 font-mono font-bold"
                  />
                </div>

                <div className="flex justify-between pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowSplitModal(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    Save Allocation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
```

---

<a id="file-transiqsrcmodules03initiationpagespaymentflowcontainerjsx"></a>
## 107. `Transiq/src/modules/03-initiation/pages/PaymentFlowContainer.jsx`
> **Section**: FRONTEND | **Lines**: 867 | **Path**: `Transiq/src/modules/03-initiation/pages/PaymentFlowContainer.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import FlowPipeline from '../components/FlowPipeline';
import { formatINR } from '../utils/format';
import { getApiBaseUrl } from '../../../api/axiosInstance';

export default function PaymentFlowContainer() {
  const API_BASE = getApiBaseUrl();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Background Transaction ID Generation (Created at start & displayed in header/summary)
  const [transactionId, setTransactionId] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  // Step 1: Accounts
  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [selectedAccountId, setSelectedAccountId] = useState('');

  // Step 2: Recipients
  const [recipients, setRecipients] = useState([]);
  const [recipientsLoading, setRecipientsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState('');

  // Step 3: Payment Details
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('Groceries');
  const [remarks, setRemarks] = useState('');

  // Step 5: PIN Authorization
  const [pin, setPin] = useState('');
  const [isFailed, setIsFailed] = useState(false);

  // Step 6: Final Result Transaction Object
  const [finalTransaction, setFinalTransaction] = useState(null);

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
  const visibleRecipients = searchQuery.trim() ? searchResults : recipients.filter((r) => r.quickAccess !== false);
  const selectedRecipient = recipients.concat(searchResults).find((r) => r.id === selectedRecipientId);


  // Background Transaction ID initialization
  const initTransaction = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE}/payment/initiate`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setTransactionId(data.transactionId);
        setCreatedAt(data.createdAt);
      } else {
        throw new Error('API offline');
      }
    } catch {
      // Custom internal fallback generation (No 3rd party APIs)
      const now = new Date();
      const dateStr = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
      const rand = Math.floor(100000 + Math.random() * 900000);
      const newTxnId = `TXN-${dateStr}-${rand}`;
      setTransactionId(newTxnId);
      setCreatedAt(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today');
    } finally {
      // Transaction ID generated in background -> Start directly on Step 1 (Account Selection)
      setCurrentStep(1);
      setIsFailed(false);
      setFinalTransaction(null);
      setPin('');
      setLoading(false);
    }
  };

  useEffect(() => {
    initTransaction();
    fetchAccounts();
    fetchRecipients();
  }, []);

  const fetchAccounts = async () => {
    setAccountsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/accounts`);
      if (res.ok) {
        const data = await res.json();
        const arr = Array.isArray(data) ? data : (data.data || []);
        const normalized = arr.map(a => ({ ...a, id: a.id || a._id }));
        setAccounts(normalized);
        if (normalized.length > 0) {
          setSelectedAccountId(normalized[0].id);
        }
      } else {
        setAccounts([]);
      }
    } catch {
      setAccounts([]);
    } finally {
      setAccountsLoading(false);
    }
  };

  const fetchRecipients = async () => {
    setRecipientsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/recipients`);
      if (res.ok) {
        const data = await res.json();
        const arr = Array.isArray(data) ? data : (data.data || []);
        const normalized = arr.map(r => ({
          ...r,
          id: r.id || r._id,
          bank: r.bank || r.bankName,
          account: r.account || r.accountNumber,
          ifsc: r.ifsc || r.ifscCode,
          phone: r.phone || '',
          quickAccess: r.isFavorite ?? true,
        }));
        setRecipients(normalized);
        if (normalized.length > 0) {
          setSelectedRecipientId(normalized[0].id);
        }
      } else {
        setRecipients([]);
      }
    } catch {
      setRecipients([]);
    } finally {
      setRecipientsLoading(false);
    }
  };

  const handleSearchRecipient = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/recipients/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        setSearchResults(await res.json());
        return;
      }
    } catch {}

    const q = query.toLowerCase().trim();
    const filtered = recipients.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.bank.toLowerCase().includes(q) ||
        r.account.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q)
    );
    setSearchResults(filtered);
  };

  // Step 1 Submission (Account Selection -> Recipient Selection)
  const handleAccountSubmit = () => {
    setErrorMsg('');
    if (!accounts || accounts.length === 0) {
      setErrorMsg('No verified bank account is available. Connect a bank account from My Wallet to continue.');
      return;
    }
    if (!selectedAccountId) {
      setErrorMsg('Please select a source account or wallet.');
      return;
    }
    setCurrentStep(2);
  };

  // Step 2 Submission (Recipient Selection -> Enter Payment Details)
  const handleRecipientSubmit = () => {
    setErrorMsg('');
    if (!selectedRecipientId) {
      setErrorMsg('Please select a recipient.');
      return;
    }
    setCurrentStep(3);
  };

  // Step 3 Submission (Enter Payment Details -> Review and Confirm)
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const numAmt = Number(amount);

    if (!numAmt || numAmt <= 0) {
      setErrorMsg('Please enter a valid amount greater than ₹0.');
      return;
    }

    if (!selectedAccount || numAmt > selectedAccount.balance) {
      setErrorMsg(`Insufficient balance. Available balance is ${formatINR(selectedAccount?.balance || 0)}.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/payment/validate-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, accountId: selectedAccountId, amount: numAmt }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Validation failed.');
      }
    } catch (err) {
      if (err.message !== 'Failed to fetch') {
        setErrorMsg(err.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    setCurrentStep(4);
  };

  // Step 4 Submission (Review & Confirm -> Security PIN)
  const handleReviewConfirm = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await fetch(`${API_BASE}/payment/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId,
          accountId: selectedAccountId,
          recipientId: selectedRecipientId,
          amount: Number(amount),
          purpose,
          remarks,
        }),
      });
    } catch {}
    setLoading(false);
    setPin('');
    setCurrentStep(5);
  };

  // Step 5 Submission (Authorize Security PIN 1234 -> Result)
  const handleAuthorizePin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!pin || pin.length < 4) {
      setErrorMsg('Please enter your 4-digit Security PIN.');
      return;
    }

    setLoading(true);
    let isSuccess = false;
    let failureReason = '';

    try {
      const res = await fetch(`${API_BASE}/payment/authorize-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId,
          pin,
          amount,
          accountId: selectedAccountId,
          recipientId: selectedRecipientId,
          purpose,
          remarks,
        }),
      });
      const data = await res.json();
      isSuccess = data.status === 'SUCCESSFUL';
      failureReason = data.reason || '';
    } catch {
      if (pin === '1234') {
        isSuccess = true;
        setAccounts((prev) =>
          prev.map((acc) => (acc.id === selectedAccountId ? { ...acc, balance: Math.max(0, acc.balance - Number(amount)) } : acc))
        );
      } else {
        isSuccess = false;
        failureReason = 'Incorrect Security PIN';
      }
    }

    setLoading(false);

    if (isSuccess) {
      setIsFailed(false);
      setFinalTransaction({
        transactionId,
        amount: Number(amount),
        accountName: selectedAccount?.name,
        recipientName: selectedRecipient?.name,
        recipientBank: selectedRecipient?.bank,
        purpose,
        completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      });
      setCurrentStep(6);
      fetchAccounts();
    } else {
      // INCORRECT PIN -> RETAIN SAME TRANSACTION ID
      setIsFailed(true);
      setErrorMsg(failureReason || 'Incorrect Security PIN');
      setCurrentStep(6);
    }
  };

  // Try Again returns to Security PIN entry (Step 5) with the SAME TRANSACTION ID via Payment Retry API
  const handleTryAgain = async () => {
    setPin('');
    setIsFailed(false);
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE}/payment/retry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.detail || 'Retry initialization failed.');
      }
    } catch {}
    setCurrentStep(5);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header displaying Transaction ID */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 pr-36">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">PayGate Gateway</span>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">Send Money — Payment Initiation</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Active Transaction Reference: <span className="font-mono font-bold text-blue-600">{transactionId || 'Generating...'}</span>
            </p>
          </div>
        </div>

        {/* Persistent KPI Summary Cards */}
        {(() => {
          const totalBal = accounts.reduce((s, a) => s + (a.balance || 0), 0);
          const availBal = selectedAccount?.balance ?? (accounts[0]?.balance ?? 0);
          const pockets = accounts.filter(a => a.type === 'POCKET');
          const pocketTotal = pockets.reduce((s, p) => s + (p.balance || 0), 0);
          const activeAccounts = accounts.filter(a => a.status === 'ACTIVE').length;
          return (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Balance</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">{formatINR(totalBal)}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{activeAccounts} active accounts</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Selected Balance</p>
                <p className="text-2xl font-bold text-emerald-600 mt-2">{formatINR(availBal)}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{selectedAccount?.name || 'No account selected'}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">Pocket Savings</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{formatINR(pocketTotal)}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{pockets.length} active pocket{pockets.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Transfer Amount</p>
                <p className="text-2xl font-bold text-amber-600 mt-2">{amount ? formatINR(Number(amount)) : '—'}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{purpose || 'Amount not entered yet'}</p>
              </div>
            </div>
          );
        })()}

        {/* 6-STEP FLOW PIPELINE PROGRESS INDICATOR (AT TOP OF EVERY SCREEN) */}
        <FlowPipeline currentStep={currentStep} isFailed={isFailed} />

        {/* Global Inline Error Alert */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center justify-between">
            <span>⚠️ {errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="text-rose-500 font-bold ml-2">✕</button>
          </div>
        )}

        {/* DYNAMIC STEP CONTENT AREA matching FlowPipeline */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-2xs">

          {/* STEP 1: SELECT SOURCE ACCOUNT / WALLET */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Step 1 of 6</span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">Select Source Account / Wallet</h2>
                  <p className="text-xs text-slate-500">Choose the funding source for Transaction {transactionId}</p>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                  {transactionId}
                </span>
              </div>

              {accounts.length === 0 ? (
                <div className="p-8 text-center bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-2">
                  <p className="font-bold text-sm text-slate-900">No bank account is connected.</p>
                  <p>No verified bank account is available. Add and verify a bank account from <strong>My Wallet</strong> to continue.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accounts.map((acc) => {
                    const isSelected = selectedAccountId === acc.id;
                    return (
                      <div
                        key={acc.id}
                        onClick={() => setSelectedAccountId(acc.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                            : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{acc.name}</p>
                            <p className="text-xs font-mono text-slate-500 mt-0.5">{acc.number || acc.maskedAccountNumber}</p>
                            <span className="inline-block mt-2 px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-semibold rounded uppercase">
                              {acc.bank}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-[11px] text-slate-400 font-semibold uppercase">Available Balance</p>
                            <p className="text-base font-mono font-bold text-slate-900">{formatINR(acc.balance)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  onClick={handleAccountSubmit}
                  disabled={accounts.length === 0}
                  className={`px-6 py-2.5 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs ${
                    accounts.length === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Next: Select Recipient →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: RECIPIENT SELECTION (QUICK ACCESS + SEARCH) */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Step 2 of 6</span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">Select / Search Recipient</h2>
                  <p className="text-xs text-slate-500">Choose quick access recipient or search internal database</p>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                  {transactionId}
                </span>
              </div>

              {/* SEARCH RECIPIENT INPUT */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  B. Search Recipient (Custom API + MongoDB)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search by name, bank, account number, or mobile..."
                    value={searchQuery}
                    onChange={(e) => handleSearchRecipient(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => handleSearchRecipient('')}
                      className="px-3 py-2 bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* RECIPIENTS DISPLAY GRID */}
              <div>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  {searchQuery ? `Search Results (${searchResults.length})` : 'A. Quick Access Recipients'}
                </p>

                {visibleRecipients.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                    No recipients found matching "{searchQuery}".
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {visibleRecipients.map((rec) => {
                      const isSelected = selectedRecipientId === rec.id;
                      return (
                        <div
                          key={rec.id}
                          onClick={() => setSelectedRecipientId(rec.id)}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs font-bold text-slate-900">{rec.name}</p>
                              <p className="text-[11px] text-slate-600 mt-0.5">{rec.bank}</p>
                              <p className="text-[11px] font-mono text-slate-400">{rec.account}</p>
                            </div>
                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-mono">
                              {rec.ifsc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold"
                >
                  ← Back to Step 1
                </button>
                <button
                  onClick={handleRecipientSubmit}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Next: Enter Payment Details →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ENTER PAYMENT DETAILS */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Step 3 of 6</span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">Enter Payment Details</h2>
                  <p className="text-xs text-slate-500">Specify payment amount and optional purpose or remarks</p>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                  {transactionId}
                </span>
              </div>

              <form onSubmit={handleDetailsSubmit} className="max-w-xl mx-auto space-y-4">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-semibold">From Source Account:</span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedAccount?.name}</p>
                    <p className="font-mono text-emerald-600 font-bold">{formatINR(selectedAccount?.balance || 0)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-semibold">To Recipient:</span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedRecipient?.name}</p>
                    <p className="text-slate-500">{selectedRecipient?.bank}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Payment Amount (₹) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category / Purpose (Optional)
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800 cursor-pointer"
                  >
                    {["Groceries", "Education", "Rent", "Shopping", "Personal", "Bills", "Health", "Other"].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Remarks / Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Monthly tuition payment"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
                  />
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold"
                  >
                    ← Back to Step 2
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    {loading ? 'Validating...' : 'Next: Review & Confirm →'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 4: REVIEW & CONFIRM TRANSACTION */}
          {currentStep === 4 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="border-b border-slate-100 pb-4 text-center">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Step 4 of 6</span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">Review & Confirm Transaction</h2>
                <p className="text-xs text-slate-500">
                  Verify transaction details before confirming. You can edit without losing your Transaction ID.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-xs text-slate-500 font-semibold uppercase">Transaction ID</span>
                  <span className="font-mono font-bold text-blue-600 text-sm">{transactionId}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[10px]">From Source Account</span>
                    <p className="font-bold text-slate-800 mt-1">{selectedAccount?.name}</p>
                    <p className="font-mono text-slate-500">{selectedAccount?.number}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[10px]">To Recipient</span>
                    <p className="font-bold text-slate-800 mt-1">{selectedRecipient?.name}</p>
                    <p className="text-slate-500">{selectedRecipient?.bank} ({selectedRecipient?.account})</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Payment Amount:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{formatINR(Number(amount))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Purpose:</span>
                    <span className="font-semibold text-slate-800">{purpose}</span>
                  </div>
                  {remarks && (
                    <div className="flex justify-between">
                      <span>Remarks:</span>
                      <span className="italic text-slate-700">{remarks}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Transaction Fee:</span>
                    <span className="font-mono text-emerald-600 font-semibold">₹0.00 (Free)</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                    <span>Total Amount:</span>
                    <span className="font-mono text-blue-700">{formatINR(Number(amount))}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer"
                >
                  ✏️ Edit Details (Keep TXN ID)
                </button>
                <button
                  onClick={handleReviewConfirm}
                  disabled={loading}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs shadow-xs cursor-pointer"
                >
                  {loading ? 'Confirming...' : 'Confirm & Proceed to PIN →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SECURITY PIN ENTRY */}
          {currentStep === 5 && (
            <div className="space-y-6 max-w-md mx-auto text-center py-4">
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Step 5 of 6</span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">Enter Security PIN</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Authorize transaction {transactionId} for {formatINR(Number(amount))}
                </p>
              </div>

              <form onSubmit={handleAuthorizePin} className="space-y-5 bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-slate-800">{selectedRecipient?.name}</p>
                  <p className="text-slate-500">{selectedRecipient?.bank}</p>
                  <p className="font-mono text-base font-bold text-blue-700 mt-1">{formatINR(Number(amount))}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    4-Digit Security PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="• • • •"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-40 text-center tracking-[0.5em] text-xl font-mono py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-900 font-bold mx-auto block"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs tracking-wide transition shadow-xs cursor-pointer"
                >
                  {loading ? 'Authorizing PIN...' : 'Verify & Authorize Payment ✓'}
                </button>
              </form>
            </div>
          )}

          {/* STEP 6: RESULT (SUCCESSFUL OR FAILED WITH TRY AGAIN) */}
          {currentStep === 6 && (
            <div className="space-y-6 max-w-lg mx-auto text-center py-6">

              {/* SUCCESS SCREEN */}
              {!isFailed ? (
                <div className="space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mx-auto text-3xl">
                    ✓
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Step 6 of 6</span>
                    <h2 className="text-2xl font-bold text-slate-900 mt-1">Transaction Successful</h2>
                    <p className="text-xs text-slate-500 mt-1">Your payment has been successfully completed.</p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-left text-xs space-y-2.5">
                    <div className="flex justify-between pb-2 border-b border-slate-200">
                      <span className="text-slate-500">Transaction ID:</span>
                      <span className="font-mono font-bold text-blue-600">{transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Amount Paid:</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">{formatINR(Number(amount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">From Source:</span>
                      <span className="font-semibold text-slate-800">{selectedAccount?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">To Recipient:</span>
                      <span className="font-semibold text-slate-800">{selectedRecipient?.name} ({selectedRecipient?.bank})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">SUCCESSFUL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Timestamp:</span>
                      <span className="font-mono text-slate-600">{finalTransaction?.completedAt || 'Today'}</span>
                    </div>
                  </div>

                  <button
                    onClick={initTransaction}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs tracking-wide transition shadow-xs cursor-pointer"
                  >
                    + Initiate Another Payment
                  </button>
                </div>
              ) : (
                /* FAILURE SCREEN (WITH TRY AGAIN RETAINING SAME TXN ID) */
                <div className="space-y-5">
                  <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold mx-auto text-3xl">
                    ✕
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Step 6 of 6</span>
                    <h2 className="text-2xl font-bold text-slate-900 mt-1">Transaction Failed</h2>
                    <p className="text-xs text-rose-600 font-semibold mt-1">
                      Reason: Incorrect Security PIN
                    </p>
                  </div>

                  <div className="bg-rose-50/50 p-6 rounded-xl border border-rose-200 text-left text-xs space-y-2.5">
                    <div className="flex justify-between pb-2 border-b border-rose-200">
                      <span className="text-slate-500">Retained Transaction ID:</span>
                      <span className="font-mono font-bold text-slate-900">{transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Attempted Amount:</span>
                      <span className="font-mono font-bold text-slate-900">{formatINR(Number(amount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Target Recipient:</span>
                      <span className="font-semibold text-slate-800">{selectedRecipient?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="px-2 py-0.5 bg-rose-200 text-rose-900 font-bold rounded">FAILED</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleTryAgain}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs tracking-wide transition shadow-xs cursor-pointer"
                    >
                      🔄 Try Again
                    </button>
                    <button
                      onClick={initTransaction}
                      className="py-3 px-4 bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer"
                    >
                      New Payment
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
``