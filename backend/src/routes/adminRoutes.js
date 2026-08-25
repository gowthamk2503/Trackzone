import { Router } from 'express';
import {
  getDashboardStats,
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAllAttendance,
  approveAttendance,
  getReports,
  getAuditLogs,
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';
import { registerValidation } from '../middleware/validator.js';

const router = Router();

// All Admin routes require valid JWT + Admin Role
router.use(authenticate, requireAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/employees', getAllEmployees);
router.post('/employees', registerValidation, createEmployee);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);

router.get('/attendance', getAllAttendance);
router.put('/attendance/:id/approve', approveAttendance);

router.get('/reports', getReports);
router.get('/audit-logs', getAuditLogs);

export default router;
