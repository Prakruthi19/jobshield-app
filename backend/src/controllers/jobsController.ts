import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { predictJobFraud } from '../ml/mlService';
import { getTrustBadge } from '../utils/helper';
import { AuthRequest } from './companyController';

const prisma = new PrismaClient();

// GET /jobs
const buildStatusFilter = (statusParam: string) => {
  if (!statusParam || statusParam === 'active') {
    return { status: 'ACTIVE' };
  }

  if (statusParam === 'all') {
    return {};
  }

  const statuses = statusParam.split(',').map(s => s.trim().toUpperCase());

  return {
    status: { in: statuses },
  };
};

export const getJobs = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '20',
      search = '',
      location = '',
      industry = '',
      minTrustScore = '0',
      maxTrustScore = '100',
      sortBy = 'createdAt',
      order = 'desc',
      status = 'active', 
    } = req.query;

    const allowedSortFields = ['createdAt', 'trustScore', 'title', 'updatedAt'];
    const allowedOrders = ['asc', 'desc'];

    const safeSortBy = allowedSortFields.includes(sortBy as string)
      ? (sortBy as string)
      : 'createdAt';

    const safeOrder = allowedOrders.includes((order as string).toLowerCase())
      ? (order as 'asc' | 'desc')
      : 'desc';

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      ...buildStatusFilter(status as string),
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search as string, mode: 'insensitive' } },
                { description: { contains: search as string, mode: 'insensitive' } },
              ],
            }
          : {},
        location ? { location: { contains: location as string, mode: 'insensitive' } } : {},
        industry ? { industry: { equals: industry as string } } : {},
        {
          trustScore: {
            gte: Number(minTrustScore),
            lte: Number(maxTrustScore),
          },
        },
      ],
    };

    const [jobs, totalCount] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              hasCompanyLogo: true,
              isVerified: true,
            },
          },
        },
        orderBy: { [safeSortBy]: safeOrder },
        skip,
        take: Number(limit),
      }),
      prisma.job.count({ where }),
    ]);

    return res.json({
      success: true,
      data: jobs.map(job => ({
        ...job,
        trustBadge: getTrustBadge(job.trustScore || 0),
      })),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / Number(limit)),
        totalCount,
      },
    });
  } catch (err) {
    console.error('Error fetching jobs:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /jobs - ML + trust score
export const createJob = async (req: Request, res: Response) => {
  try {
    const jobData = req.body;

    const prediction = await predictJobFraud(jobData);

    let trustScore = Math.round((1 - prediction.fraud_probability) * 100);

    if (!jobData.description) trustScore -= 10;
    if (!jobData.salaryRange) trustScore -= 5;
    if (!jobData.requirements) trustScore -= 3;
    if (jobData.hasCompanyLogo) trustScore += 5;
    if (jobData.hasQuestions) trustScore += 3;

    trustScore = Math.max(0, Math.min(100, trustScore));

    // Require authenticated user to set postedBy relation
    const postedByUserId = (req as any).user?.id;
    if (!postedByUserId) {
      return res.status(401).json({ message: 'Unauthorized: must be logged in to create jobs' });
    }

    // Extract only safe fields from jobData, excluding relations and auto-generated fields
    const safeJobFields = {
      title: jobData.title,
      location: jobData.location,
      department: jobData.department,
      salaryRange: jobData.salaryRange,
      companyProfile: jobData.companyProfile,
      description: jobData.description,
      requirements: jobData.requirements,
      benefits: jobData.benefits,
      telecommuting: jobData.telecommuting,
      hasCompanyLogo: jobData.hasCompanyLogo,
      hasQuestions: jobData.hasQuestions,
      employmentType: jobData.employmentType,
      requiredExperience: jobData.requiredExperience,
      requiredEducation: jobData.requiredEducation,
      industry: jobData.industry,
      function: jobData.function,
      fraudulent: jobData.fraudulent,
      slug: jobData.slug,
    };

    const jobCreateData: any = {
      ...safeJobFields,
      mlFraudProbability: prediction.fraud_probability,
      mlModelVersion: 'v1.0-production',
      mlPredictedAt: new Date(),
      trustScore,
      trustScoreUpdatedAt: new Date(),
      status: prediction.is_fraudulent ? 'SUSPENDED' : 'ACTIVE',
    };

    // Connect the company relation
    if (jobData.companyId) {
      jobCreateData.company = { connect: { id: jobData.companyId } };
    }

    // Connect the postedBy relation
    jobCreateData.postedBy = { connect: { id: postedByUserId } };

    const job = await prisma.job.create({
      data: jobCreateData,
    });

    await prisma.mlPrediction.create({
      data: {
        jobId: job.id,
        modelVersion: 'v1.0-production',
        modelName: 'RandomForest',
        fraudProbability: prediction.fraud_probability,
        isFraudulent: prediction.is_fraudulent,
        confidenceScore: prediction.confidence,
        topFraudIndicators: [],
      },
    });

    return res.status(201).json({
      success: true,
      message: prediction.is_fraudulent
        ? 'Job flagged as suspicious & suspended for review.'
        : 'Job created successfully.',
      data: job,
    });
  } catch (err) {
    console.error('Error creating job:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};



export const getMyJobs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const {
      page = '1',
      limit = '20',
      search = '',
      location = '',
      industry = '',
      minTrustScore = '0',
      maxTrustScore = '100',
      sortBy = 'createdAt',
      order = 'desc',
      status = 'active',
    } = req.query;

    const allowedSortFields = ['createdAt', 'trustScore', 'title'];
    const allowedOrders = ['asc', 'desc'];

    const safeSortBy = allowedSortFields.includes(sortBy as string)
      ? (sortBy as string)
      : 'createdAt';

    const safeOrder = allowedOrders.includes((order as string).toLowerCase())
      ? (order as 'asc' | 'desc')
      : 'desc';

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      postedByUserId: userId,  
      ...buildStatusFilter(status as string),
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search as string, mode: 'insensitive' } },
                { description: { contains: search as string, mode: 'insensitive' } },
              ],
            }
          : {},
        location ? { location: { contains: location as string, mode: 'insensitive' } } : {},
        industry ? { industry: { equals: industry as string } } : {},
        {
          trustScore: {
            gte: Number(minTrustScore),
            lte: Number(maxTrustScore),
          },
        },
      ],
    };

    const [jobs, totalCount] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              hasCompanyLogo: true,
              isVerified: true,
            },
          },
        },
        orderBy: [ { [safeSortBy]: safeOrder },{ id: 'desc' }],
        skip,
        take: Number(limit),
      }),
      prisma.job.count({ where }),
    ]);

    return res.json({
      success: true,
      data: jobs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / Number(limit)),
        totalCount,
      },
    });
  } catch (err) {
    console.error('Error fetching my jobs:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};



export const deleteJob = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const jobId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedByUserId !== userId) {
      return res.status(403).json({ message: "You cannot delete this job" });
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "CLOSED",
      },
    });

    return res.status(200).json({
      message: "Job deactivated successfully",
      job: updatedJob,
    });

  } catch (error) {
    console.error("Delete Job Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getJobById = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;    
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            hasCompanyLogo: true,
            isVerified: true,
          },
        },
      },
    }); 
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.json({
      success: true,
      data: job,
    });
  } catch (err) {
    console.error("Error fetching job by ID:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const updateJob = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const jobId = req.params.id;
    const updatedData = req.body;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.postedByUserId !== userId) {
      return res.status(403).json({ message: "You cannot update this job" });
    }
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: updatedData,
    });
    return res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update Job Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};




export const applyToJob = async (req: Request, res: Response) => {
   try {
    const { jobId } = req.params;
    const { name, email, address } = req.body;

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Resume is required" });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;

    const application = await prisma.jobApplication.create({
      data: {
        name,
        email,
        address,
        resumeUrl,
        job: { connect: { id: jobId } },
        user: { connect: { id: userId } },
      },
    });

    return res.status(201).json(application);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to apply" });
  }
};


export const getMyApplications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const applications = await prisma.jobApplication.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(applications);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch applications" });
  }
};
