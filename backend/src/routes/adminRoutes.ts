import { Router } from 'express';
import { adminStats, getAllJobsAdmin, getAllUsersAdmin } from '../controllers/adminController';
import { authenticate, authorizeAdmin } from '../middleware/middleware';
import { adminLogin, adminRegister } from '../controllers/authController';


const router = Router();

router.get("/stats", authenticate, authorizeAdmin, adminStats);
router.get("/users",authenticate, authorizeAdmin, getAllUsersAdmin);
router.get("/jobs", authenticate,authorizeAdmin, getAllJobsAdmin);
router.post("/register", adminRegister);
router.post("/login", adminLogin);

export default router;