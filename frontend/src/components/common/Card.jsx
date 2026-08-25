import React from 'react';
import { clsx } from 'clsx';

export const Card = ({
  children,
  className = '',
  title = null,
  subtitle = null,
  action = null,
  icon = null,
  glow = false,
}) => {
  return (
    <div
      className={clsx(
        'glass-card rounded-2xl p-5 md:p-6 relative overflow-hidden',
        glow && 'ring-1 ring-indigo-500/20 shadow-lg shadow-indigo-500/5',
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100 dark:border-gray-800/80">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
