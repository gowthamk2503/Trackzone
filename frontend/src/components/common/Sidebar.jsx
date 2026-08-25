import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  PlaneTakeoff,
  MapPin,
  CalendarCheck,
  User,
  Users,
  Shield,
  FileSpreadsheet,
  History,
  Building2,
  Fingerprint,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin } = useAuth();

  const employeeLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Attendance History', path: '/history', icon: Clock },
    { name: 'Monthly Calendar', path: '/calendar', icon: CalendarDays },
    { name: 'Leave Management', path: '/leaves', icon: PlaneTakeoff },
    { name: 'Office Locations', path: '/offices', icon: MapPin },
    { name: 'Holiday Schedule', path: '/holidays', icon: CalendarCheck },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'Command Center', path: '/admin', icon: Shield },
    { name: 'Employee Directory', path: '/admin/employees', icon: Users },
    { name: 'Attendance Logs', path: '/admin/attendance', icon: Clock },
    { name: 'Geofence Manager', path: '/admin/geofence', icon: Building2 },
    { name: 'Leave Approvals', path: '/admin/leaves', icon: PlaneTakeoff },
    { name: 'Analytics & Reports', path: '/admin/reports', icon: FileSpreadsheet },
    { name: 'Audit Trail', path: '/admin/audit-logs', icon: History },
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={clsx(
          'fixed lg:sticky top-0 lg:top-16 left-0 z-40 h-screen lg:h-[calc(100vh-4rem)] w-64 glass-card border-r border-gray-200/80 dark:border-gray-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-4 overflow-y-auto">
          {/* Section Indicator */}
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            {isAdmin ? 'Administration Portal' : 'Employee Workspace'}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 mt-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/admin' || link.path === '/dashboard'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150',
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60'
                    )
                  }
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          {/* If Employee, show quick link to Admin if authorized */}
          {user?.role === 'admin' && (
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Mode Switch
              </div>
              <NavLink
                to={isAdmin ? '/dashboard' : '/admin'}
                className="flex items-center gap-3 px-3.5 py-2 mt-1 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
              >
                <Fingerprint className="w-4 h-4" />
                Switch to {isAdmin ? 'Employee App' : 'Admin Hub'}
              </NavLink>
            </div>
          )}
        </div>

        {/* Bottom Geofence Shield Status */}
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-[#A294F9]/15 via-[#CDC1FF]/10 to-[#E5D9F2]/10 border border-[#A294F9]/30">
          <div className="flex items-center gap-2 text-xs font-bold text-[#7967DE] dark:text-[#CDC1FF]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Geofence Engine Active
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
            Real-time GPS boundary & WebAuthn biometric validation verified.
          </p>
        </div>
      </aside>
    </>
  );
};
