import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  {
    label: 'Request',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#667eea"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M3 12L12 4l9 8" />
        <path d="M9 21V9h6v12" />
      </svg>
    ),
    path: '/',
  },
  {
    label: 'Respond',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#667eea"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <path d="M9 4v2a3 3 0 0 0 6 0V4" />
      </svg>
    ),
    path: '/browse',
  },
  {
    label: 'Manage',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#667eea"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <path d="M17 17a5 5 0 0 0 5-5V5H2v7a5 5 0 0 0 5 5" />
        <path d="M7 5V3h10v2" />
      </svg>
    ),
    path: '/manage',
  },
  {
    label: 'Help',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#667eea"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 1 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12" y2="17" />
      </svg>
    ),
    path: '/help',
  },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed left-0 bottom-0 w-full h-16 bg-white/95 shadow-inner flex justify-around items-center z-50">
      {navItems.map((item, i) => {
        const active =
          location.pathname === item.path ||
          (item.path === '/' && location.pathname === '/');
        return (
          <button
            key={item.label}
            className={`flex flex-col items-center justify-center flex-1 h-full text-xs font-medium transition ${
              active
                ? 'text-white bg-indigo-500 rounded-t-xl'
                : 'text-indigo-600'
            }`}
            onClick={() => navigate(item.path)}
            aria-current={active ? 'page' : undefined}>
            <span className="mb-1">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
