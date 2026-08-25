import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  disabled = false,
  ...props
}) => {
  const variantStyles = {
    primary:
      'bg-[#A294F9] hover:bg-[#8E7DEE] text-white shadow-md shadow-[#A294F9]/25 active:bg-[#7967DE] disabled:bg-[#CDC1FF]/50',
    accent:
      'bg-[#CDC1FF] hover:bg-[#B7A9FB] text-gray-900 font-bold shadow-md shadow-[#CDC1FF]/25 active:bg-[#A294F9] disabled:bg-[#E5D9F2]',
    secondary:
      'bg-[#E5D9F2]/60 dark:bg-[#1C1736] text-gray-900 dark:text-white hover:bg-[#E5D9F2] dark:hover:bg-[#28214D] border border-[#CDC1FF]/40 dark:border-[#2F275A] active:bg-[#CDC1FF]/50',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20 active:bg-rose-800 disabled:bg-rose-400',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 active:bg-emerald-800 disabled:bg-emerald-400',
    outline:
      'border border-[#A294F9]/50 dark:border-[#A294F9]/50 bg-transparent text-[#7967DE] dark:text-[#CDC1FF] hover:bg-[#A294F9]/10 active:bg-[#A294F9]/20',
    ghost:
      'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-[#A294F9]/10 dark:hover:bg-[#A294F9]/15',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm font-semibold rounded-xl gap-2',
    lg: 'px-6 py-3 text-base font-semibold rounded-xl gap-2.5',
  };

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#A294F9]/30 disabled:cursor-not-allowed disabled:opacity-60',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};
