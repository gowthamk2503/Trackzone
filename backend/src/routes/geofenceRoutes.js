import { Router } from 'express';
import {
  listOffices,
  getActiveOffices,
  getOfficeById,
  createOffice,
  updateOffice,
  deleteOffice,
} from '../controllers/geofenceController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';
import { geofenceValidation } from '../middleware/validator.js';

const router = Router();

// Public / Authenticated read routes
router.get('/active', getActiveOffices);
router.get('/', listOffices);
router.get('/:id', getOfficeById);

// Admin-only management routes
router.post('/', authenticate, requireAdmin, geofenceValidation, createOffice);
router.put('/:id', authenticate, requireAdmin, updateOffice);
router.delete('/:id', authenticate, requireAdmin, deleteOffice);

export default router;
