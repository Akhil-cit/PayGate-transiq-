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
