import { Router } from 'express';
import {
  getHolidays,
  addHoliday,
  deleteHoliday,
} from '../controllers/holidayController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';

const router = Router();

router.get('/', getHolidays);
router.post('/', authenticate, requireAdmin, addHoliday);
router.delete('/:id', authenticate, requireAdmin, deleteHoliday);

export default router;
