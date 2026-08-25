import React, { useState, useEffect } from 'react';
import { PlaneTakeoff, Filter } from 'lucide-react';
import { getStatusBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LeaveApprovalModal } from '../../components/admin/LeaveApprovalModal';
import { leaveService } from '../../services/api';

export const LeaveManagementPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadLeaves = async () => {
    setLoading(true);
    try {
      const res = await leaveService.getAllLeaves({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });

      if (res.data.success) {
        setLeaves(res.data.leaves || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, [statusFilter]);

  const handleReview = (leave) => {
    setSelectedLeave(leave);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PlaneTakeoff className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Workforce Operations
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            Leave Approvals & Time-Off Requests
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Review submitted leave requests, evaluate team availability, and approve or reject applications
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Applications</option>
            <option value="Pending">Pending Review Only</option>
            <option value="Approved">Approved Requests</option>
            <option value="Rejected">Rejected Requests</option>
          </select>
        </div>
      </div>

      {/* Leaves List */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80">
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Days</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-medium">
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No leave requests found matching filters.
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => {
                  const emp = typeof leave.employee === 'object' ? leave.employee : null;

                  return (
                    <tr
                      key={leave._id}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 dark:text-white block">
                          {emp?.name || leave.employeeId}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {emp?.department} • {leave.employeeId}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400">
                        {leave.leaveType}
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        {leave.startDate} to {leave.endDate}
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                        {leave.totalDays} day(s)
                      </td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {leave.reason}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(leave.status)}</td>
                      <td className="py-3 px-4 text-right">
                        {leave.status === 'Pending' ? (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleReview(leave)}
                            className="text-xs"
                          >
                            Review & Decide
                          </Button>
                        ) : (
                          <button
                            onClick={() => handleReview(leave)}
                            className="text-xs font-semibold text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            View Details
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      <LeaveApprovalModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        leaveRequest={selectedLeave}
        onUpdated={loadLeaves}
      />
    </div>
  );
};
