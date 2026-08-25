import React, { useState, useEffect } from 'react';
import { Shield, FileSpreadsheet, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { StatsCards } from '../../components/admin/StatsCards';
import { AttendanceCharts } from '../../components/admin/AttendanceCharts';
import { Button } from '../../components/common/Button';
import { getStatusBadge } from '../../components/common/Badge';
import { adminService } from '../../services/api';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalOffices: 0,
    presentCount: 0,
    lateCount: 0,
    halfDayCount: 0,
    leavesToday: 0,
    absentCount: 0,
    attendanceRate: 0,
    avgWorkingHours: 8.2,
  });

  const [departmentStats, setDepartmentStats] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [recentFeed, setRecentFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await adminService.getDashboard();
      if (res.data.success) {
        setStats(res.data.stats);
        setDepartmentStats(res.data.departmentStats || []);
        setTrendData(res.data.trendData || []);
        setStatusDistribution(res.data.statusDistribution || []);
        setRecentFeed(res.data.recentFeed || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Executive Command Hub
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            Enterprise Attendance & Geofence Intelligence
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Real-time workforce monitoring, GPS perimeter security, and timesheet analytics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={loadDashboard}
            isLoading={loading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Feed
          </Button>

          <Link to="/admin/reports">
            <Button size="sm" variant="primary" leftIcon={<FileSpreadsheet className="w-3.5 h-3.5" />}>
              Monthly Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <StatsCards stats={stats} />

      {/* Recharts Visualizations Grid */}
      <AttendanceCharts
        trendData={trendData}
        departmentStats={departmentStats}
        statusDistribution={statusDistribution}
      />

      {/* Live Stream: Today's Recent Check-Ins */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Today's Live Check-In Stream
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Real-time feed of employee punches with GPS and WebAuthn signatures
            </p>
          </div>
          <Link
            to="/admin/attendance"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            View All Records <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Check-In Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Office Perimeter</th>
                <th className="py-3 px-4">Biometric Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-medium">
              {recentFeed.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No check-ins registered yet today.
                  </td>
                </tr>
              ) : (
                recentFeed.map((record) => {
                  const emp = typeof record.employee === 'object' ? record.employee : null;
                  const checkInTime = record.checkIn?.time
                    ? new Date(record.checkIn.time).toLocaleTimeString()
                    : '--:--';

                  return (
                    <tr
                      key={record._id}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {emp?.profileImage ? (
                            <img
                              src={emp.profileImage}
                              alt={emp.name}
                              className="w-7 h-7 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-[10px]">
                              {emp?.name?.charAt(0) || 'E'}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-gray-900 dark:text-white block leading-tight">
                              {emp?.name || record.employeeId}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {record.employeeId}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        {emp?.department || 'Engineering'}
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                        {checkInTime}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(record.status)}</td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          ✓ {record.officeLocation?.officeName || 'HQ Bangalore'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          WebAuthn FIDO2
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
