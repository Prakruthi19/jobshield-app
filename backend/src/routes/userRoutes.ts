import { Router } from 'express';
import { authenticate as authentication } from '../middleware/middleware';

import { getUserProfile, updateUserProfile } from '../controllers/userController';
const router = Router();

router.get('/getUserProfile/:userId', authentication, getUserProfile);
router.put('/updateUserProfile/:userId', authentication, updateUserProfile);

// router.get('/:userId/phone', getUserPhone)
// router.get('/demo', demo);
export default router;

