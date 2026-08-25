import { Router } from 'express';
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} from '../controllers/leaveController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';
import { leaveValidation } from '../middleware/validator.js';

const router = Router();

router.use(authenticate);

// Employee routes
router.post('/apply', leaveValidation, applyLeave);
router.get('/my', getMyLeaves);

// Admin routes
router.get('/all', requireAdmin, getAllLeaves);
router.put('/:id/status', requireAdmin, updateLeaveStatus);

export default router;
