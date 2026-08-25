import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Clock, RefreshCw } from 'lucide-react';
import { AttendanceTable } from '../../components/attendance/AttendanceTable';
import { Button } from '../../components/common/Button';
import { attendanceService } from '../../services/api';

export const AttendanceHistoryPage = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await attendanceService.getHistory({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        limit: 100,
      });

      if (res.data.success) {
        setRecords(res.data.records || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [startDate, endDate]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Audit-Grade Attendance Record
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            Complete Attendance History
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Detailed log of check-in, check-out, working hours, and physical office validation
          </p>
        </div>

        {/* Date Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium"
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium"
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={loadHistory}
            isLoading={loading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80">
        <AttendanceTable
          records={records}
          isLoading={loading}
          onRefresh={loadHistory}
          userName={user?.name}
          showActions={true}
        />
      </div>
    </div>
  );
};
