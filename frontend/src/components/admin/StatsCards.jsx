import React from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Timer,
  TrendingUp,
} from 'lucide-react';

export const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Workforce',
      value: stats?.totalEmployees || 0,
      subtext: `${stats?.totalOffices || 3} Active Geofenced Offices`,
      icon: Users,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
      border: 'border-indigo-500/20',
    },
    {
      title: 'Present Today',
      value: stats?.presentCount || 0,
      subtext: `${stats?.attendanceRate || 0}% Workforce Attendance Rate`,
      icon: UserCheck,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      border: 'border-emerald-500/20',
      trend: `+${stats?.attendanceRate || 0}%`,
    },
    {
      title: 'Late Arrivals',
      value: stats?.lateCount || 0,
      subtext: 'Punched in after 09:30 AM',
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      title: 'Absent / On Leave',
      value: (stats?.absentCount || 0) + (stats?.leavesToday || 0),
      subtext: `${stats?.leavesToday || 0} on authorized leave`,
      icon: UserX,
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-500/10',
      border: 'border-rose-500/20',
    },
    {
      title: 'Avg Working Hours',
      value: `${stats?.avgWorkingHours || 8.2} hrs`,
      subtext: 'Standard shift: 8.0 hrs/day',
      icon: Timer,
      color: 'text-sky-500',
      bg: 'bg-sky-50 dark:bg-sky-500/10',
      border: 'border-sky-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`glass-card rounded-2xl p-5 border ${card.border} glass-card-hover relative overflow-hidden`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.bg} ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                {card.value}
              </span>
              {card.trend && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" />
                  {card.trend}
                </span>
              )}
            </div>

            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
};
