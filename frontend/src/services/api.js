import axios from 'axios';

const API_BASE_URL = import.meta.env?.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('trackzone_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('trackzone_refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          if (res.data.success && res.data.accessToken) {
            localStorage.setItem('trackzone_access_token', res.data.accessToken);
            if (res.data.refreshToken) {
              localStorage.setItem('trackzone_refresh_token', res.data.refreshToken);
            }
            originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshErr) {
          localStorage.removeItem('trackzone_access_token');
          localStorage.removeItem('trackzone_refresh_token');
          localStorage.removeItem('trackzone_user');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

// API Service Endpoints
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.post('/users/change-password', data),
  getNotifications: () => api.get('/users/notifications'),
  markNotificationRead: (id) => api.put(`/users/notifications/${id}/read`),
};

export const attendanceService = {
  checkIn: (data) => api.post('/attendance/checkin', data),
  checkOut: (data) => api.post('/attendance/checkout', data),
  getToday: () => api.get('/attendance/today'),
  getHistory: (params) => api.get('/attendance/history', { params }),
  getMonthly: (params) => api.get('/attendance/monthly', { params }),
  requestRegularization: (data) => api.post('/attendance/regularize', data),
};

export const geofenceService = {
  list: () => api.get('/geofence'),
  getActive: () => api.get('/geofence/active'),
  getById: (id) => api.get(`/geofence/${id}`),
  create: (data) => api.post('/geofence', data),
  update: (id, data) => api.put(`/geofence/${id}`, data),
  delete: (id) => api.delete(`/geofence/${id}`),
};

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getEmployees: (params) => api.get('/admin/employees', { params }),
  createEmployee: (data) => api.post('/admin/employees', data),
  updateEmployee: (id, data) => api.put(`/admin/employees/${id}`, data),
  deleteEmployee: (id) => api.delete(`/admin/employees/${id}`),
  getAttendance: (params) => api.get('/admin/attendance', { params }),
  approveAttendance: (id, data) => api.put(`/admin/attendance/${id}/approve`, data),
  getReports: (params) => api.get('/admin/reports', { params }),
  getAuditLogs: (params) => api.get('/admin/audit-logs', { params }),
};

export const leaveService = {
  apply: (data) => api.post('/leaves/apply', data),
  getMyLeaves: () => api.get('/leaves/my'),
  getAllLeaves: (params) => api.get('/leaves/all', { params }),
  updateStatus: (id, data) => api.put(`/leaves/${id}/status`, data),
};

export const holidayService = {
  getHolidays: (params) => api.get('/holidays', { params }),
  addHoliday: (data) => api.post('/holidays', data),
  deleteHoliday: (id) => api.delete(`/holidays/${id}`),
};

export const webauthnService = {
  getRegistrationOptions: () => api.post('/webauthn/register/options'),
  verifyRegistration: (data) => api.post('/webauthn/register/verify', data),
  getAuthenticationOptions: () => api.post('/webauthn/authenticate/options'),
  verifyAuthentication: (data) => api.post('/webauthn/authenticate/verify', data),
};
