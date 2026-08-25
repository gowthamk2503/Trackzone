import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, Edit, Trash2, MapPin } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmployeeModal } from '../../components/admin/EmployeeModal';
import { adminService, geofenceService } from '../../services/api';

export const EmployeesManagementPage = () => {
  const [employees, setEmployees] = useState([]);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [empRes, offRes] = await Promise.all([
        adminService.getEmployees({
          search: searchTerm || undefined,
          department: deptFilter !== 'ALL' ? deptFilter : undefined,
        }),
        geofenceService.list(),
      ]);

      if (empRes.data.success) {
        setEmployees(empRes.data.employees || []);
      }
      if (offRes.data.success) {
        setOffices(offRes.data.offices || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [deptFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleToggleStatus = async (emp) => {
    if (window.confirm(`Are you sure you want to toggle status for ${emp.name}?`)) {
      try {
        await adminService.deleteEmployee(emp._id);
        loadData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Workforce Directory
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            Employee Directory & Credentials
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Manage staff profiles, office geofence assignments, and biometric status
          </p>
        </div>

        <Button
          size="md"
          variant="primary"
          onClick={() => {
            setEmployeeToEdit(null);
            setShowModal(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-bold shadow-lg shadow-indigo-500/20"
        >
          Add New Employee
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card rounded-3xl p-4 border border-gray-200/80 dark:border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
          />
        </form>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="py-2 px-3 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product & Design">Product & Design</option>
            <option value="Infrastructure & DevOps">Infrastructure & DevOps</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Marketing & Sales">Marketing & Sales</option>
            <option value="Executive Management">Executive Management</option>
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80">
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Emp ID</th>
                <th className="py-3 px-4">Department & Role</th>
                <th className="py-3 px-4">Assigned Office</th>
                <th className="py-3 px-4">Shift Hours</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-medium">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No employees matching criteria.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => {
                  const officeName =
                    typeof emp.officeId === 'object'
                      ? emp.officeId?.officeName
                      : 'Bangalore HQ';

                  return (
                    <tr
                      key={emp._id}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {emp.profileImage ? (
                            <img
                              src={emp.profileImage}
                              alt={emp.name}
                              className="w-8 h-8 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs">
                              {emp.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-gray-900 dark:text-white block leading-tight">
                              {emp.name}
                            </span>
                            <span className="text-[11px] text-gray-400">{emp.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {emp.employeeId}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900 dark:text-white block">
                          {emp.designation}
                        </span>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">
                          {emp.department} • {emp.role === 'admin' ? 'Admin' : 'Staff'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1.5 truncate max-w-[160px]">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                          <span className="truncate">{officeName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        {emp.shiftSchedule || '09:00 - 18:00'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={emp.isActive ? 'success' : 'danger'} dot>
                          {emp.isActive ? 'Active' : 'Deactivated'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEmployeeToEdit(emp);
                              setShowModal(true);
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title="Edit Employee"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(emp)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title={emp.isActive ? 'Deactivate Account' : 'Activate Account'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <EmployeeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        employeeToEdit={employeeToEdit}
        offices={offices}
        onSaved={loadData}
      />
    </div>
  );
};
