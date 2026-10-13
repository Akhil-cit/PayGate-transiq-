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
