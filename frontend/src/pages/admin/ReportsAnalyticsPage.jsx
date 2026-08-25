import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { ReportGenerator } from '../../components/admin/ReportGenerator';

export const ReportsAnalyticsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Workforce Timesheet Reports
          </span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
          Attendance Analytics & Timesheet Export
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Generate comprehensive audit reports, filter by billing month and department, and export to PDF or Excel (.xlsx)
        </p>
      </div>

      <ReportGenerator />
    </div>
  );
};
