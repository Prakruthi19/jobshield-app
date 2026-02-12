import { Router } from 'express';
import { applyToJob } from '../controllers/jobsController';
import { authenticate } from '../middleware/middleware';
import { uploadResume } from '../middleware/uploadResume';
import { getJobApplicationsForEmployer, getMyApplications } from '../controllers/applicationController';

const router = Router();
router.post("/apply/:jobId",   authenticate,  uploadResume.single("resume"), applyToJob);
router.get("/getUserApplications", authenticate, getMyApplications);
router.get("/getEmployerApplications", authenticate, getJobApplicationsForEmployer);

export default router;