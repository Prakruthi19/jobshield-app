import { Router } from 'express';
import { getJobs, createJob, getMyJobs, deleteJob, getJobById, updateJob, applyToJob, getMyApplications } from '../controllers/jobsController';
import { authenticate } from '../middleware/middleware';
import { uploadResume } from '../middleware/uploadResume';


const router = Router();

router.get('/getJobs', getJobs);
router.post('/createJob', authenticate, createJob);
router.get('/getMyJobs', authenticate, getMyJobs);
router.delete('/deleteJob/:id', authenticate, deleteJob);
router.get('/getJobs/:id', authenticate, getJobById); 
router.put('/updateJob/:id', authenticate, updateJob);
router.post("/applications/:jobId",   authenticate,  uploadResume.single("resume"), applyToJob);
router.get("/applications/:userId", authenticate, getMyApplications);
export default router;
