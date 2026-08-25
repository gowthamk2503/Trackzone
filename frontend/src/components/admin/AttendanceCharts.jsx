import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const AttendanceCharts = ({
  trendData,
  departmentStats,
  statusDistribution,
}) => {
  // Custom Dark Mode Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-800 p-3 rounded-xl shadow-xl text-xs">
          <p className="font-bold text-white mb-1">{label}</p>
          {payload.map((item, idx) => (
            <p key={idx} style={{ color: item.color }} className="font-semibold">
              {item.name}: {item.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. 7-Day Attendance Trend (Area Chart) */}
      <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              7-Day Attendance Trend
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Daily Present vs Late vs Half-day volume
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            Real-Time Feed
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="lateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="present"
                name="Present (On Time)"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#presentGrad)"
              />
              <Area
                type="monotone"
                dataKey="late"
                name="Late Arrivals"
                stroke="#F59E0B"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#lateGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Today's Status Distribution (Donut / Pie Chart) */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Today's Attendance Ratio
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Workforce status distribution
          </p>
        </div>

        <div className="h-56 w-full flex items-center justify-center relative my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-gray-100 dark:border-gray-800">
          {statusDistribution.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-gray-600 dark:text-gray-400 text-[11px] truncate">
                {item.name}: <strong className="text-gray-900 dark:text-white">{item.value}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Department-Wise Attendance Rate (Bar Chart) */}
      <div className="lg:col-span-3 glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Department-Wise Attendance Performance
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Real-time check-in adherence per operational department
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={departmentStats}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="department" stroke="#9CA3AF" fontSize={11} tickLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar
                dataKey="totalEmployees"
                name="Total Staff"
                fill="#6366F1"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="presentToday"
                name="Present Today"
                fill="#10B981"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
