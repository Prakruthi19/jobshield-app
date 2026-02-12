import { Router } from 'express';
import { getJobs, createJob, getMyJobs, deleteJob, getJobById, updateJob } from '../controllers/jobsController';
import { authenticate } from '../middleware/middleware';



const router = Router();

router.get('/getJobs', getJobs);
router.post('/createJob', authenticate, createJob);
router.get('/getMyJobs', authenticate, getMyJobs);
router.delete('/deleteJob/:id', authenticate, deleteJob);
router.get('/getJobs/:id', authenticate, getJobById); 
router.put('/updateJob/:id', authenticate, updateJob);

export default router;
