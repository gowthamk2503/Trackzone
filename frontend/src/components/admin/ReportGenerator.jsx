import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, FileText, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button';
import { exportMonthlyReportPDF, exportToExcel } from '../../utils/exportUtils';
import { adminService } from '../../services/api';

export const ReportGenerator = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState('ALL');
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const loadReports = async () => {
    setLoading(true);
    try {
      const [yearStr, monthStr] = month.split('-');
      const res = await adminService.getReports({
        year: yearStr,
        month: monthStr,
        department: department !== 'ALL' ? department : undefined,
      });

      if (res.data.success) {
        setReports(res.data.reports || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [month, department]);

  const handleExportPDF = () => {
    exportMonthlyReportPDF(reports, month);
  };

  const handleExportExcel = () => {
    const dataForExcel = reports.map((r) => ({
      'Employee ID': r.employeeId,
      Name: r.name,
      Email: r.email,
      Department: r.department,
      Designation: r.designation,
      Office: r.office,
      'Present Days': r.presentDays,
      'Late Days': r.lateDays,
      'Half Days': r.halfDays,
      'Absent Days': r.absentDays,
      'Approved Leaves': r.leaveDays,
      'Total Working Hours': r.totalHours,
      'Average Daily Hours': r.averageHours,
      'Attendance Rate (%)': r.attendanceRate,
    }));
    exportToExcel(dataForExcel, `trackzone_attendance_report_${month}`);
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Workforce Attendance & Timesheet Reports
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Generate audited monthly summaries with export capabilities
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportPDF}
            disabled={reports.length === 0}
            leftIcon={<FileText className="w-4 h-4 text-rose-500" />}
          >
            Export PDF
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExportExcel}
            disabled={reports.length === 0}
            leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-500" />}
          >
            Export Excel (.xlsx)
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
            Billing Month
          </label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
            Filter Department
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product & Design">Product & Design</option>
            <option value="Infrastructure & DevOps">Infrastructure & DevOps</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Marketing & Sales">Marketing & Sales</option>
          </select>
        </div>

        <div className="self-end">
          <Button
            size="sm"
            variant="secondary"
            onClick={loadReports}
            isLoading={loading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="py-3 px-4">Emp ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Present</th>
              <th className="py-3 px-4">Late</th>
              <th className="py-3 px-4">Half Day</th>
              <th className="py-3 px-4">Leaves</th>
              <th className="py-3 px-4">Total Hours</th>
              <th className="py-3 px-4">Avg Hrs/Day</th>
              <th className="py-3 px-4">Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-medium">
            {reports.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-gray-400">
                  {loading ? 'Compiling workforce report...' : 'No data recorded for selected period.'}
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr
                  key={r.employeeId}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                    {r.employeeId}
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    {r.name}
                  </td>
                  <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                    {r.department}
                  </td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">
                    {r.presentDays}
                  </td>
                  <td className="py-3 px-4 text-amber-600 dark:text-amber-400 font-bold">
                    {r.lateDays}
                  </td>
                  <td className="py-3 px-4 text-indigo-600 dark:text-indigo-400 font-bold">
                    {r.halfDays}
                  </td>
                  <td className="py-3 px-4 text-sky-600 dark:text-sky-400 font-bold">
                    {r.leaveDays}
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                    {r.totalHours} hrs
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {r.averageHours} hrs
                  </td>
                  <td className="py-3 px-4 font-bold">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] ${
                        r.attendanceRate >= 90
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : r.attendanceRate >= 75
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {r.attendanceRate}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
