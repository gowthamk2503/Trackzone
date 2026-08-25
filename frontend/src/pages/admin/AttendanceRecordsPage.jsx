import React, { useState, useEffect } from 'react';
import { Clock, Download, FileSpreadsheet } from 'lucide-react';
import { getStatusBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { adminService } from '../../services/api';
import { exportAttendanceToPDF, exportToExcel } from '../../utils/exportUtils';

export const AttendanceRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  const [overrideData, setOverrideData] = useState({
    status: 'Present',
    approvalStatus: 'Approved',
    workingHours: 8.5,
    remarks: '',
  });

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAttendance({
        date: selectedDate || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        department: departmentFilter !== 'ALL' ? departmentFilter : undefined,
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
    loadAttendance();
  }, [selectedDate, statusFilter, departmentFilter]);

  const handleOpenOverride = (rec) => {
    setSelectedRecord(rec);
    setOverrideData({
      status: rec.status,
      approvalStatus: rec.approvalStatus || 'Approved',
      workingHours: rec.workingHours || 8.0,
      remarks: rec.remarks || 'Admin verified attendance override',
    });
    setShowOverrideModal(true);
  };

  const handleSaveOverride = async (e) => {
    e.preventDefault();
    if (!selectedRecord) return;

    try {
      await adminService.approveAttendance(selectedRecord._id, overrideData);
      setShowOverrideModal(false);
      loadAttendance();
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportPDF = () => {
    exportAttendanceToPDF(records, 'Master Attendance Audit Trail');
  };

  const handleExportExcel = () => {
    const data = records.map((r) => ({
      Date: r.date,
      'Employee ID': r.employeeId,
      Name: typeof r.employee === 'object' ? r.employee?.name : 'N/A',
      Department: typeof r.employee === 'object' ? r.employee?.department : 'N/A',
      'Check In': r.checkIn?.time ? new Date(r.checkIn.time).toLocaleTimeString() : 'N/A',
      'Check Out': r.checkOut?.time ? new Date(r.checkOut.time).toLocaleTimeString() : 'N/A',
      'Hours Logged': r.workingHours,
      Status: r.status,
      'Office Location': r.officeLocation?.officeName || 'HQ',
      'Approval State': r.approvalStatus,
    }));
    exportToExcel(data, 'master_attendance_logs');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Master Logs
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            Global Attendance Records & Approvals
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Audit-grade record of employee punches, geofence compliance, and administrative overrides
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportPDF}
            disabled={records.length === 0}
            leftIcon={<Download className="w-4 h-4 text-rose-500" />}
          >
            Export PDF
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportExcel}
            disabled={records.length === 0}
            leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-500" />}
          >
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="glass-card rounded-3xl p-4 border border-gray-200/80 dark:border-gray-800/80 flex flex-wrap items-center gap-3">
        <div>
          <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Late">Late Arrival</option>
            <option value="Half-day">Half Day</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
            Department
          </label>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product & Design">Product & Design</option>
            <option value="Infrastructure & DevOps">DevOps</option>
            <option value="Human Resources">HR</option>
            <option value="Marketing & Sales">Marketing</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80">
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Check In</th>
                <th className="py-3 px-4">Check Out</th>
                <th className="py-3 px-4">Logged Hours</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Geofence Compliance</th>
                <th className="py-3 px-4 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-medium">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    No attendance records found matching filters.
                  </td>
                </tr>
              ) : (
                records.map((r) => {
                  const emp = typeof r.employee === 'object' ? r.employee : null;
                  const checkInTime = r.checkIn?.time
                    ? new Date(r.checkIn.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '--:--';
                  const checkOutTime = r.checkOut?.time
                    ? new Date(r.checkOut.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '--:--';

                  return (
                    <tr
                      key={r._id}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                        {r.date}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 dark:text-white">
                            {emp?.name || r.employeeId}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            ({r.employeeId})
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{checkInTime}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{checkOutTime}</td>
                      <td className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400">
                        {r.workingHours || 0} hrs
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(r.status)}</td>
                      <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                        ✓ {r.officeLocation?.officeName || 'HQ Bangalore'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenOverride(r)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                        >
                          Override / Regularize
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Override Attendance Modal */}
      <Modal
        isOpen={showOverrideModal}
        onClose={() => setShowOverrideModal(false)}
        title="Override Attendance Record"
        subtitle={`Adjust status or rectify log for ${selectedRecord?.employeeId} (${selectedRecord?.date})`}
      >
        <form onSubmit={handleSaveOverride} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Attendance Status
            </label>
            <select
              value={overrideData.status}
              onChange={(e) => setOverrideData({ ...overrideData, status: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Present">Present (Full Day)</option>
              <option value="Late">Late Arrival</option>
              <option value="Half-day">Half Day</option>
              <option value="Absent">Absent</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Adjusted Working Hours
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={overrideData.workingHours}
              onChange={(e) =>
                setOverrideData({ ...overrideData, workingHours: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Auditor Remarks
            </label>
            <input
              type="text"
              required
              value={overrideData.remarks}
              onChange={(e) => setOverrideData({ ...overrideData, remarks: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowOverrideModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Override
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
