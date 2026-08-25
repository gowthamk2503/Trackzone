import React, { useState } from 'react';
import {
  MapPin,
  Download,
  Search,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { getStatusBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { exportAttendanceToPDF } from '../../utils/exportUtils';
import { attendanceService } from '../../services/api';

export const AttendanceTable = ({
  records,
  isLoading = false,
  onRefresh,
  userName = 'Employee',
  showActions = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showRegularizeModal, setShowRegularizeModal] = useState(false);
  const [regularizeReason, setRegularizeReason] = useState('');
  const [submittingReg, setSubmittingReg] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.date.includes(searchTerm) ||
      rec.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rec.officeLocation?.officeName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || rec.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenRegularize = (record) => {
    setSelectedRecord(record);
    setRegularizeReason('');
    setFeedbackMsg('');
    setShowRegularizeModal(true);
  };

  const handleRegularizeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRecord) return;

    setSubmittingReg(true);
    setFeedbackMsg('');

    try {
      const res = await attendanceService.requestRegularization({
        attendanceId: selectedRecord._id,
        reason: regularizeReason,
      });

      if (res.data.success) {
        setFeedbackMsg('Regularization request submitted for administrative approval!');
        if (onRefresh) onRefresh();
        setTimeout(() => {
          setShowRegularizeModal(false);
        }, 1200);
      }
    } catch (err) {
      setFeedbackMsg(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmittingReg(false);
    }
  };

  const handleExportPDF = () => {
    exportAttendanceToPDF(filteredRecords, 'Attendance History Report', userName);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by date (YYYY-MM-DD), ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Late">Late Arrival</option>
              <option value="Half-day">Half Day</option>
              <option value="Absent">Absent</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleExportPDF}
          leftIcon={<Download className="w-4 h-4 text-indigo-500" />}
        >
          Download PDF Report
        </Button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Check In</th>
              <th className="py-3.5 px-4">Check Out</th>
              <th className="py-3.5 px-4">Working Hours</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Office Zone</th>
              <th className="py-3.5 px-4">Biometrics</th>
              {showActions && <th className="py-3.5 px-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-medium">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-400">
                  No attendance records found matching your filters.
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => {
                const checkInStr = record.checkIn?.time
                  ? new Date(record.checkIn.time).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '--:--';
                const checkOutStr = record.checkOut?.time
                  ? new Date(record.checkOut.time).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '--:--';

                return (
                  <tr
                    key={record._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                      {record.date}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {checkInStr}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {checkOutStr}
                    </td>
                    <td className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400">
                      {record.workingHours || 0} hrs
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(record.status)}</td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">
                          {record.officeLocation?.officeName || 'HQ Bangalore'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        WebAuthn
                      </span>
                    </td>
                    {showActions && (
                      <td className="py-3 px-4 text-right">
                        {record.status === 'Late' || record.status === 'Half-day' ? (
                          <button
                            onClick={() => handleOpenRegularize(record)}
                            className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            Regularize
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-400">Verified</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Attendance Regularization Modal */}
      <Modal
        isOpen={showRegularizeModal}
        onClose={() => setShowRegularizeModal(false)}
        title="Request Attendance Regularization"
        subtitle={`Submit discrepancy explanation for ${selectedRecord?.date}`}
      >
        <form onSubmit={handleRegularizeSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Current Logged Status
            </label>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              <span>Status: {selectedRecord?.status}</span>
              <span>Logged Hours: {selectedRecord?.workingHours} hrs</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Reason / Justification
            </label>
            <textarea
              required
              rows={3}
              placeholder="E.g., Client meeting at client site, Network connectivity delay, Biometric scanner glitch..."
              value={regularizeReason}
              onChange={(e) => setRegularizeReason(e.target.value)}
              className="w-full p-3 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {feedbackMsg && (
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium">
              {feedbackMsg}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowRegularizeModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={submittingReg}
            >
              Submit Regularization
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
