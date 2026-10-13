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
