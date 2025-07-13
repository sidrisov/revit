import React from 'react';

export type StatusType = 'success' | 'info' | 'warning' | 'pending';

const badgeStyles: Record<StatusType, string> = {
  success: 'bg-green-100 text-green-800',
  info: 'bg-blue-100 text-blue-800',
  warning: 'bg-yellow-100 text-yellow-800',
  pending: 'bg-gray-100 text-gray-700',
};

const StatusBadge: React.FC<{
  type: StatusType;
  children: React.ReactNode;
}> = ({ type, children }) => (
  <span
    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badgeStyles[type]}`}>
    {children}
  </span>
);

export default StatusBadge;
