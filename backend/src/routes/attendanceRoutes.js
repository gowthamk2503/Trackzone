import { Router } from 'express';
import {
  checkIn,
  checkOut,
  getTodayStatus,
  getHistory,
  getMonthlySummary,
  requestRegularization,
} from '../controllers/attendanceController.js';
import { authenticate } from '../middleware/auth.js';
import { checkInValidation } from '../middleware/validator.js';

const router = Router();

router.use(authenticate);

router.post('/checkin', checkInValidation, checkIn);
router.post('/checkout', checkOut);
router.get('/today', getTodayStatus);
router.get('/history', getHistory);
router.get('/monthly', getMonthlySummary);
router.post('/regularize', requestRegularization);

export default router;
