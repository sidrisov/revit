import React from 'react';

const AppBar: React.FC = () => (
  <header className="fixed top-0 left-0 w-full h-14 bg-white/90 z-50 flex items-center shadow-sm border-b">
    <div className="w-full flex items-center justify-between px-4">
      <span className="font-bold text-lg flex items-center gap-2">
        🎯 <span>Revit</span>
      </span>
      <span className="flex items-center text-gray-700">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#222"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-2.2 3.6-4 8-4s8 1.8 8 4" />
        </svg>
      </span>
    </div>
  </header>
);

export default AppBar;
