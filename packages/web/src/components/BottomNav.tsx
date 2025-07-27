import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  {
    label: 'Request',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
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
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
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
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
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
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
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

const actionButtons = [
  {
    label: 'Record',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
    action: () => console.log('Record audio'),
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    label: 'Search',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    action: () => console.log('Search'),
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    label: 'Analytics',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
    action: () => console.log('Analytics'),
    color: 'bg-pink-500 hover:bg-pink-600',
  },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed left-0 bottom-0 w-full z-50">
      {/* Action Buttons Row */}
      <div className="bg-white/95 shadow-sm border-t border-gray-200 px-4 py-2">
        <div className="flex justify-center gap-3">
          {actionButtons.map((button) => (
            <button
              key={button.label}
              className={`${button.color} text-white p-2 rounded-full transition-colors duration-200 flex items-center justify-center`}
              onClick={button.action}
              title={button.label}>
              {button.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Main Navigation Row */}
      <nav
        aria-label="Bottom Navigation"
        className="bg-white/95 shadow-inner flex justify-around items-center h-16">
        {navItems.map((item) => {
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
    </div>
  );
};

export default BottomNav;
