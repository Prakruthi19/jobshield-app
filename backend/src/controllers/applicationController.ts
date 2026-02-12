import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export type AuthRequest = Request & { user?: { id: string; role: string } };

const prisma = new PrismaClient();
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


export const getJobApplicationsForEmployer = async (req: AuthRequest, res: Response) => {
  try {
    const employerId = req.user?.id;
    if (!employerId) return res.status(401).json({ message: "Unauthorized" });

    const applications = await prisma.jobApplication.findMany({
      where: {
        job: {
          postedByUserId: employerId,
        },
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(applications);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch employer applications" });
  }
};
