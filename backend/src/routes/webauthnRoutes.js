import { Router } from 'express';
import {
  getRegistrationOptions,
  verifyRegistration,
  getAuthenticationOptions,
  verifyAuthentication,
} from '../controllers/webauthnController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All WebAuthn passkey actions require authenticated user session
router.use(authenticate);

// Passkey Registration Flow
router.post('/register/options', getRegistrationOptions);
router.post('/register/verify', verifyRegistration);

// Passkey Authentication Flow
router.post('/authenticate/options', getAuthenticationOptions);
router.post('/authenticate/verify', verifyAuthentication);

export default router;
