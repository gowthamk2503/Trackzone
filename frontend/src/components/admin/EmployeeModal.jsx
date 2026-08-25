import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { adminService } from '../../services/api';

export const EmployeeModal = ({
  isOpen,
  onClose,
  employeeToEdit,
  offices,
  onSaved,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: 'Software Engineer',
    role: 'employee',
    officeId: '',
    shiftSchedule: '09:00 - 18:00',
    password: '',
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        name: employeeToEdit.name,
        email: employeeToEdit.email,
        phone: employeeToEdit.phone,
        department: employeeToEdit.department,
        designation: employeeToEdit.designation,
        role: employeeToEdit.role,
        officeId:
          typeof employeeToEdit.officeId === 'object'
            ? employeeToEdit.officeId?._id
            : employeeToEdit.officeId || '',
        shiftSchedule: employeeToEdit.shiftSchedule || '09:00 - 18:00',
        password: '',
        isActive: employeeToEdit.isActive,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: 'Engineering',
        designation: 'Software Engineer',
        role: 'employee',
        officeId: offices[0]?._id || '',
        shiftSchedule: '09:00 - 18:00',
        password: 'Password@123',
        isActive: true,
      });
    }
    setErrorMsg('');
  }, [employeeToEdit, isOpen, offices]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (employeeToEdit) {
        await adminService.updateEmployee(employeeToEdit._id, formData);
      } else {
        await adminService.createEmployee(formData);
      }
      onSaved();
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save employee profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employeeToEdit ? 'Edit Employee Profile' : 'Register New Employee'}
      subtitle={
        employeeToEdit
          ? `Modify settings for ${employeeToEdit.name} (${employeeToEdit.employeeId})`
          : 'Provision corporate credentials & assign geofenced office'
      }
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-medium">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Full Legal Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Corporate Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Assigned Office Geofence
            </label>
            <select
              value={formData.officeId}
              onChange={(e) => setFormData({ ...formData, officeId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            >
              {offices.map((off) => (
                <option key={off._id} value={off._id}>
                  {off.officeName} ({off.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Department
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Engineering">Engineering</option>
              <option value="Product & Design">Product & Design</option>
              <option value="Infrastructure & DevOps">Infrastructure & DevOps</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Marketing & Sales">Marketing & Sales</option>
              <option value="Executive Management">Executive Management</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Designation
            </label>
            <input
              type="text"
              required
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              System Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            >
              <option value="employee">Employee</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Shift Hours
            </label>
            <input
              type="text"
              value={formData.shiftSchedule}
              onChange={(e) => setFormData({ ...formData, shiftSchedule: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {!employeeToEdit && (
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Temporary Password
            </label>
            <input
              type="text"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={loading}>
            {employeeToEdit ? 'Save Changes' : 'Create Employee'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
