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
