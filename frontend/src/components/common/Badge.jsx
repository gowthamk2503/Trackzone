import React from 'react';
import { clsx } from 'clsx';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  dot = false,
}) => {
  const variantStyles = {
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    info: 'bg-[#CDC1FF]/20 text-[#614FC4] dark:text-[#CDC1FF] border-[#CDC1FF]/40',
    pink: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
    purple: 'bg-[#A294F9]/15 text-[#614FC4] dark:text-[#CDC1FF] border-[#A294F9]/30',
    lavender: 'bg-[#A294F9]/15 text-[#614FC4] dark:text-[#CDC1FF] border-[#A294F9]/30',
    neutral: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
  };

  const dotColors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-[#CDC1FF]',
    pink: 'bg-pink-500',
    purple: 'bg-[#A294F9]',
    lavender: 'bg-[#A294F9]',
    neutral: 'bg-gray-400',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-sm font-medium',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
};

export const getStatusBadge = (status) => {
  switch (status) {
    case 'Present':
      return <Badge variant="success" dot>Present</Badge>;
    case 'Late':
      return <Badge variant="warning" dot>Late Arrival</Badge>;
    case 'Half-day':
      return <Badge variant="purple" dot>Half Day</Badge>;
    case 'Absent':
      return <Badge variant="danger" dot>Absent</Badge>;
    case 'On Leave':
      return <Badge variant="info" dot>On Leave</Badge>;
    case 'Approved':
      return <Badge variant="success">Approved</Badge>;
    case 'Pending':
      return <Badge variant="warning">Pending</Badge>;
    case 'Rejected':
      return <Badge variant="danger">Rejected</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};
