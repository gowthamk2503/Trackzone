import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Employee Pages
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { AttendanceHistoryPage } from './pages/employee/AttendanceHistoryPage';
import { MonthlyCalendarPage } from './pages/employee/MonthlyCalendarPage';
import { LeavePage } from './pages/employee/LeavePage';
import { OfficeLocationsPage } from './pages/employee/OfficeLocationsPage';
import { HolidaysPage } from './pages/employee/HolidaysPage';
import { ProfilePage } from './pages/employee/ProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { EmployeesManagementPage } from './pages/admin/EmployeesManagementPage';
import { AttendanceRecordsPage } from './pages/admin/AttendanceRecordsPage';
import { GeofenceManagementPage } from './pages/admin/GeofenceManagementPage';
import { LeaveManagementPage } from './pages/admin/LeaveManagementPage';
import { ReportsAnalyticsPage } from './pages/admin/ReportsAnalyticsPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';

export const App = () => {
  return (
    <Routes>
      {/* Public Landing & Authentication Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Authenticated Application Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Employee Module Routes */}
        <Route path="/dashboard" element={<EmployeeDashboard />} />
        <Route path="/history" element={<AttendanceHistoryPage />} />
        <Route path="/calendar" element={<MonthlyCalendarPage />} />
        <Route path="/leaves" element={<LeavePage />} />
        <Route path="/offices" element={<OfficeLocationsPage />} />
        <Route path="/holidays" element={<HolidaysPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin Module Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute requireAdmin>
              <EmployeesManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/attendance"
          element={
            <ProtectedRoute requireAdmin>
              <AttendanceRecordsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/geofence"
          element={
            <ProtectedRoute requireAdmin>
              <GeofenceManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leaves"
          element={
            <ProtectedRoute requireAdmin>
              <LeaveManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute requireAdmin>
              <ReportsAnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute requireAdmin>
              <AuditLogsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
