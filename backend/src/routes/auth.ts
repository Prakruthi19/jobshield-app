import { Router } from 'express';
import { register, login, demo, getUserPhone } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/:userId/phone', getUserPhone)
router.get('/demo', demo);

export default router;

