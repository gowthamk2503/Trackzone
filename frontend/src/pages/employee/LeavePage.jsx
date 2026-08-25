import React, { useState, useEffect } from 'react';
import { PlaneTakeoff, Plus } from 'lucide-react';
import { getStatusBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { leaveService } from '../../services/api';

export const LeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const [formData, setFormData] = useState({
    leaveType: 'Paid Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadLeaves = async () => {
    setLoading(true);
    try {
      const res = await leaveService.getMyLeaves();
      if (res.data.success) {
        setLeaves(res.data.leaves || []);
        setStats(res.data.stats || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await leaveService.apply(formData);
      if (res.data.success) {
        setShowApplyModal(false);
        setFormData({
          leaveType: 'Paid Leave',
          startDate: '',
          endDate: '',
          reason: '',
        });
        loadLeaves();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PlaneTakeoff className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Time Off Portal
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            Leave & Time-Off Management
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Submit time-off requests, monitor approval status, and track leave quota
          </p>
        </div>

        <Button
          size="md"
          variant="primary"
          onClick={() => setShowApplyModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-bold shadow-lg shadow-indigo-500/20"
        >
          Apply for Leave
        </Button>
      </div>

      {/* KPI Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-4 border border-indigo-500/20">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              Paid Leave Balance
            </span>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
              {stats.leaveBalance} <span className="text-xs text-gray-400 font-normal">days left</span>
            </p>
          </div>
          <div className="glass-card rounded-2xl p-4 border border-emerald-500/20">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              Approved Leave Days
            </span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {stats.totalApprovedDays} <span className="text-xs text-gray-400 font-normal">days</span>
            </p>
          </div>
          <div className="glass-card rounded-2xl p-4 border border-amber-500/20">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              Pending Applications
            </span>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {stats.pendingApplications}
            </p>
          </div>
          <div className="glass-card rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              Total Applications
            </span>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
              {stats.totalLeavesApplied}
            </p>
          </div>
        </div>
      )}

      {/* Leaves History Table */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
          My Leave History & Status
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Days</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Approved By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-medium">
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No leave requests submitted yet.
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr
                    key={leave._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                      {leave.leaveType}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {leave.startDate} to {leave.endDate}
                    </td>
                    <td className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400">
                      {leave.totalDays} day(s)
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {leave.reason}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(leave.status)}</td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                      {typeof leave.approvedBy === 'object'
                        ? leave.approvedBy?.name || 'Admin'
                        : leave.status === 'Pending'
                        ? 'Under Review'
                        : 'System Admin'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Submit Leave Application"
        subtitle="Request planned or emergency time-off"
      >
        <form onSubmit={handleApply} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Leave Category
            </label>
            <select
              value={formData.leaveType}
              onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Paid Leave">Paid Annual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Emergency Leave">Emergency Leave</option>
              <option value="Maternity/Paternity Leave">Maternity / Paternity Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Reason / Justification
            </label>
            <textarea
              required
              rows={3}
              placeholder="Explain the purpose of your time off request..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowApplyModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={submitting}
            >
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
