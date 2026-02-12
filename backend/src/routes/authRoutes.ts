import { Router } from 'express';
import {register, login, logout, googleAuth} from '../controllers/authController';
import { authenticate as authentication } from '../middleware/middleware';
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authentication,logout);
router.post('/google-login', googleAuth);
// router.get('/:userId/phone', getUserPhone)
// router.get('/demo', demo);
export default router;

