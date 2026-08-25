import React, { useState, useEffect } from 'react';
import { History, Search, Filter, RefreshCw } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { adminService } from '../../services/api';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAuditLogs({
        category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
        search: searchTerm || undefined,
        limit: 100,
      });

      if (res.data.success) {
        setLogs(res.data.logs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadLogs();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Security Compliance
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            System Audit Trail & Access Logs
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Immutable log of system events, authentication attempts, geofence modifications, and attendance actions
          </p>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={loadLogs}
          isLoading={loading}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Log Trail
        </Button>
      </div>

      {/* Filter Row */}
      <div className="glass-card rounded-3xl p-4 border border-gray-200/80 dark:border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by action, user, details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </form>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="py-2 px-3 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Categories</option>
            <option value="AUTH">Authentication (AUTH)</option>
            <option value="ATTENDANCE">Attendance (ATTENDANCE)</option>
            <option value="GEOFENCE">Geofencing (GEOFENCE)</option>
            <option value="EMPLOYEE">Employees (EMPLOYEE)</option>
            <option value="LEAVE">Leaves (LEAVE)</option>
            <option value="SYSTEM">System & Config (SYSTEM)</option>
          </select>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80">
        <div className="space-y-3">
          {logs.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs">
              No audit logs matching query.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log._id}
                className="p-4 rounded-2xl bg-gray-50/60 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        log.category === 'AUTH'
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          : log.category === 'ATTENDANCE'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : log.category === 'GEOFENCE'
                          ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                          : 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {log.category}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      [{log.action}]
                    </span>
                    <span className="text-gray-400 text-[11px]">
                      by <strong className="text-gray-700 dark:text-gray-300">{log.userName}</strong> ({log.userRole})
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-xs font-sans">
                    {log.details}
                  </p>
                </div>

                <div className="text-right text-[11px] text-gray-400 font-sans sm:flex-shrink-0">
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                  <span className="block text-[10px] text-gray-500">
                    IP: {log.ipAddress}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
