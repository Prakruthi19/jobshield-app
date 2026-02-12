import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/middleware';
import {
  getCompanies,
  getCompanyByIdentifier,
  createCompany,
  updateCompany,
  deleteCompany,
  verifyCompany,
  unverifyCompany,
  getCompanyStats,
  listIndustries,
  searchCompanies,
  getMyCompanies,
} from '../controllers/companyController';

const router = Router();

router.get('/', getCompanies);
router.get('/search/advanced', searchCompanies);
router.get('/meta/industries', listIndustries);
router.get('/my-companies', authenticate, authorizeRoles('EMPLOYER','ADMIN'), getMyCompanies);
router.get('/:identifier', getCompanyByIdentifier);
router.post('/create', authenticate, authorizeRoles('EMPLOYER','ADMIN'), createCompany);
router.put('/:id', authenticate, authorizeRoles('EMPLOYER','ADMIN'), updateCompany);
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), deleteCompany);
router.patch('/:id/verify', authenticate, authorizeRoles('ADMIN'), verifyCompany);
router.patch('/:id/unverify', authenticate, authorizeRoles('ADMIN'), unverifyCompany);
router.get('/:id/stats', getCompanyStats);

export default router;
