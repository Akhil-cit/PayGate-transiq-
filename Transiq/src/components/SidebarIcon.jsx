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
