import { Router } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { getSettings, putSettings } from '../controllers/settingsController';

const router = Router();

router.get('/', (req, res) => getSettings(req as AuthRequest, res));
router.put('/', (req, res) => putSettings(req as AuthRequest, res));

export default router;
