// ============================================
// COMPANIES API ROUTES
// File: src/routes/companies.ts
// ============================================

// companies.controller.ts

import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';

const prisma = new PrismaClient();
export type AuthRequest = Request & { user?: { id: string; role: string } };

// ============================================
// 1. GET ALL COMPANIES
// ============================================
export const getCompanies = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '20',
      search = '',
      industry = '',
      verified = '',
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {
      status: 'ACTIVE',
      AND: [],
    };

    if (search) {
      where.AND.push({
        OR: [
          { name: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ],
      });
    }

    if (industry) where.AND.push({ industry });
    if (verified === 'true') where.AND.push({ isVerified: true });
    if (verified === 'false') where.AND.push({ isVerified: false });

    const [companies, totalCount] = await Promise.all([
      prisma.company.findMany({
        where,
        include: {
          _count: { select: { jobs: true } },
        },
        orderBy: { [sortBy as string]: order },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.company.count({ where }),
    ]);

    res.json({
      success: true,
      data: companies.map(c => ({ ...c, jobsCount: c._count.jobs })),
      pagination: {
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(totalCount / +limit),
        totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message,
    });
  }
};


// ============================================
// 2. GET COMPANY BY ID OR SLUG (Public)
// ============================================
export const getCompanyByIdentifier = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;

    if (!identifier) {
      res.status(400).json({
        success: false,
        message: 'Identifier is required',
      });
      return;
    }

    // Check if identifier is UUID or slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

    const company = await prisma.company.findUnique({
      where: isUUID ? { id: identifier } : { slug: identifier },
      include: {
        reputation: true,
        jobs: {
          where: { status: 'ACTIVE' },
          select: {
            id: true,
            title: true,
            location: true,
            employmentType: true,
            trustScore: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!company || company.status === 'DELETED') {
      res.status(404).json({
        success: false,
        message: 'Company not found',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        ...company
      },
    });
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message,
    });
  }
};

// ============================================
// 3. CREATE COMPANY (Employer/Admin only)
// ============================================
export const createCompany = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      description,
      industry,
      companySize,
      foundedYear,
      websiteUrl,
      email,
      phone,
      hasCompanyLogo,
      headquartersLocation,
      headquartersCountry,
      coverImageUrl,
      linkedinUrl,
    } = req.body;

    // Validation
    if (!name) {
      res.status(400).json({
        success: false,
        message: 'Company name is required',
      });
      return;
    }

    // Generate slug from name
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check for duplicate slug
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.company.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const company = await prisma.company.create({
      data: {
        name,
        slug,
        description,
        industry,
        companySize,
        foundedYear,
        websiteUrl,
        email,
        phone,
        hasCompanyLogo,
        headquartersLocation,
        headquartersCountry,
        coverImageUrl,
        linkedinUrl,
        createdByUserId: req.user!.id,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company,
    });
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message,
    });
  }
};

// ============================================
// 4. UPDATE COMPANY (Employer/Admin only)
// ============================================
export const updateCompany =  async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id },
    });

    if (!existingCompany || existingCompany.status === 'DELETED') {
      res.status(404).json({
        success: false,
        message: 'Company not found',
      });
      return;
    }

    // Check ownership (unless admin)
    if (req.user!.role !== 'ADMIN' && existingCompany.createdByUserId !== req.user!.id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this company',
      });
      return;
    }

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.slug;
    delete updateData.createdByUserId;
    delete updateData.isVerified;
    delete updateData.verificationDate;

    const company = await prisma.company.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Company updated successfully',
      data: company,
    });
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message,
    });
  }
};

// ============================================
// 5. DELETE COMPANY (Soft delete - Admin only)
// ============================================
export const deleteCompany =  async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      res.status(404).json({
        success: false,
        message: 'Company not found',
      });
      return;
    }

    await prisma.company.update({
      where: { id },
      data: { status: 'DELETED' },
    });

    res.json({
      success: true,
      message: 'Company deleted successfully',
      data: { id, name: company.name },
    });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message,
    });
  }
};

// ============================================
// 6. VERIFY COMPANY (Admin only)
// ============================================
export const verifyCompany =async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { verificationDocuments } = req.body;

    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      res.status(404).json({
        success: false,
        message: 'Company not found',
      });
      return;
    }

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: {
        isVerified: true,
        verificationDate: new Date(),
        verificationDocuments: verificationDocuments || {},
      },
    });

    res.json({
      success: true,
      message: 'Company verified successfully',
      data: updatedCompany,
    });
  } catch (error) {
    console.error('Error verifying company:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message,
    });
  }
};

// ============================================
// 7. UNVERIFY COMPANY (Admin only)
// ============================================
export const unverifyCompany = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      res.status(404).json({
        success: false,
        message: 'Company not found',
      });
      return;
    }

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: {
        isVerified: false,
        verificationDate: null,
        verificationDocuments: undefined,
      },
    });

    res.json({
      success: true,
      message: 'Company verification removed',
      data: updatedCompany,
    });
  } catch (error) {
    console.error('Error unverifying company:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message,
    });
  }
};

// ============================================
// 8. GET COMPANY STATISTICS (Public)
// ============================================
export const getCompanyStats =  async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            jobs: true,
          },
        },
      },
    });

    if (!company || company.status === 'DELETED') {
      res.status(404).json({
        success: false,
        message: 'Company not found',
      });
      return;
    }

    // Get job statistics
    const jobStats = await prisma.job.groupBy({
      by: ['status'],
      where: { companyId: id },
      _count: true,
    });

    // Get average trust score
    const trustScoreAvg = await prisma.job.aggregate({
      where: { companyId: id },
      _avg: {
        trustScore: true,
      },
    });

    // Get total applications
    const totalApplications = await prisma.jobApplication.count({
      where: {
        job: {
          companyId: id,
        },
      },
    });

    res.json({
      success: true,
      data: {
        totalJobs: company._count.jobs,
        jobsByStatus: jobStats.reduce((acc, stat) => {
          acc[stat.status] = stat._count;
          return acc;
        }, {} as Record<string, number>),
        averageTrustScore: Math.round(trustScoreAvg._avg.trustScore || 0),
        totalApplications,
        isVerified: company.isVerified,
      },
    });
  } catch (error) {
    console.error('Error fetching company stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message,
    });
  }
};

// ============================================
// 9. GET INDUSTRIES LIST (Helper endpoint)
// ============================================
export const listIndustries = async (_req: any, res: Response) => {
  try {
    const industries = await prisma.company.findMany({
      where: {
        industry: { not: null },
        status: 'ACTIVE',
      },
      select: {
        industry: true,
      },
      distinct: ['industry'],
      orderBy: {
        industry: 'asc',
      },
    });

    res.json({
      success: true,
      data: industries.map(i => i.industry).filter(Boolean),
    });
  } catch (error) {
    console.error('Error fetching industries:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message,
    });
  }
};

// ============================================
// 10. SEARCH COMPANIES (Public)
// ============================================
export const searchCompanies = async (req: any, res: Response) => {
  try {
    const {
      query = '',
      industry = '',
      verified = '',
      location = '',
    } = req.query;

    const where: any = {
      status: 'ACTIVE',
      AND: [],
    };

    if (query) {
      where.AND.push({
        OR: [
          { name: { contains: query as string, mode: 'insensitive' } },
          { description: { contains: query as string, mode: 'insensitive' } },
        ],
      });
    }

    if (industry) {
      where.AND.push({ industry: { equals: industry as string } });
    }

    if (location) {
      where.AND.push({
        OR: [
          { headquartersLocation: { contains: location as string, mode: 'insensitive' } },
          { headquartersCountry: { contains: location as string, mode: 'insensitive' } },
        ],
      });
    }

    if (verified === 'true') {
      where.AND.push({ isVerified: true });
    }

    const companies = await prisma.company.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        industry: true,
        companySize: true,
        hasCompanyLogo: true,
        headquartersLocation: true,
        isVerified: true,
        _count: {
          select: {
            jobs: {
              where: { status: 'ACTIVE' },
            },
          },
        },
      },
      take: 50,
    });

    res.json({
      success: true,
      data: companies.map(company => ({
        ...company,
        activeJobs: company._count.jobs,
      })),
    });
  } catch (error) {
    console.error('Error searching companies:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message,
    });
  }
};

export const getMyCompanies = async (req: AuthRequest, res: Response) => {
  try {
    const companies = await prisma.company.findMany({
      where: {
        createdByUserId: req.user!.id,
        status: 'ACTIVE',
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: companies,
    });
  } catch (error) {
    console.error('Error fetching employer companies:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message,
    });
  }
};
