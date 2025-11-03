import { Router } from 'express';
import { register, login, demo} from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/demo', demo);

export default router;

