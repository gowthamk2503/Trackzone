import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { leaveService } from '../../services/api';
import { CheckCircle2, XCircle } from 'lucide-react';

export const LeaveApprovalModal = ({
  isOpen,
  onClose,
  leaveRequest,
  onUpdated,
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!leaveRequest) return null;

  const handleUpdateStatus = async (status) => {
    setLoading(true);
    setErrorMsg('');

    try {
      await leaveService.updateStatus(leaveRequest._id, {
        status,
        rejectionReason: status === 'Rejected' ? rejectionReason : undefined,
      });
      onUpdated();
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update leave status');
    } finally {
      setLoading(false);
    }
  };

  const emp = typeof leaveRequest.employee === 'object' ? leaveRequest.employee : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Leave Application"
      subtitle={`Application by ${emp?.name || leaveRequest.employeeId}`}
    >
      <div className="space-y-4 text-xs">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-medium">
            {errorMsg}
          </div>
        )}

        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-500 dark:text-gray-400">Employee</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {emp?.name} ({leaveRequest.employeeId})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-500 dark:text-gray-400">Department</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {emp?.department || 'Engineering'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-500 dark:text-gray-400">Leave Category</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {leaveRequest.leaveType}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-500 dark:text-gray-400">Duration</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {leaveRequest.startDate} to {leaveRequest.endDate} ({leaveRequest.totalDays} days)
            </span>
          </div>

          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="font-bold text-gray-500 dark:text-gray-400 block mb-1">
              Reason Provided:
            </span>
            <p className="text-gray-700 dark:text-gray-300 italic bg-white dark:bg-gray-900 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700">
              "{leaveRequest.reason}"
            </p>
          </div>
        </div>

        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            Rejection Comments (Required only if rejecting):
          </label>
          <input
            type="text"
            placeholder="E.g. Inadequate team coverage during sprint deadline..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => handleUpdateStatus('Rejected')}
            isLoading={loading}
            leftIcon={<XCircle className="w-4 h-4" />}
          >
            Reject Request
          </Button>

          <Button
            type="button"
            variant="success"
            size="sm"
            onClick={() => handleUpdateStatus('Approved')}
            isLoading={loading}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            Approve Leave
          </Button>
        </div>
      </div>
    </Modal>
  );
};
