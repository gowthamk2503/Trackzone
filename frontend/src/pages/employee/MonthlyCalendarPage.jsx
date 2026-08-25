import React, { useState, useEffect } from 'react';
import { CalendarDays, Download } from 'lucide-react';
import { AttendanceCalendar } from '../../components/attendance/AttendanceCalendar';
import { Button } from '../../components/common/Button';
import { attendanceService } from '../../services/api';
import { exportAttendanceToPDF } from '../../utils/exportUtils';
import { useAuth } from '../../context/AuthContext';

export const MonthlyCalendarPage = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMonthlyData = async (monthStr) => {
    setLoading(true);
    try {
      const [year, month] = monthStr.split('-');
      const res = await attendanceService.getMonthly({ year, month });

      if (res.data.success) {
        setRecords(res.data.records || []);
        setSummary(res.data.summary || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMonthlyData(currentMonth);
  }, [currentMonth]);

  const handleExportPDF = () => {
    exportAttendanceToPDF(
      records,
      `Monthly Attendance Breakdown (${currentMonth})`,
      user?.name
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Interactive Timesheet
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            Monthly Attendance Calendar
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Color-coded visual representation of your shift punctuality and logged hours
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleExportPDF}
          disabled={records.length === 0}
          leftIcon={<Download className="w-4 h-4 text-indigo-500" />}
        >
          Export Monthly PDF
        </Button>
      </div>

      {/* Summary Stat Chips */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-4 border border-emerald-500/20">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              Days Present
            </span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {summary.totalPresent}
            </p>
          </div>
          <div className="glass-card rounded-2xl p-4 border border-amber-500/20">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              Late Check-Ins
            </span>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {summary.totalLate}
            </p>
          </div>
          <div className="glass-card rounded-2xl p-4 border border-indigo-500/20">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              Total Hours Logged
            </span>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
              {summary.totalHours} hrs
            </p>
          </div>
          <div className="glass-card rounded-2xl p-4 border border-sky-500/20">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              Average Hours / Day
            </span>
            <p className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">
              {summary.averageDailyHours} hrs
            </p>
          </div>
        </div>
      )}

      {/* Calendar Grid Component */}
      <AttendanceCalendar
        records={records}
        currentMonth={currentMonth}
        onMonthChange={(newMonth) => setCurrentMonth(newMonth)}
      />
    </div>
  );
};
