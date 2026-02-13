import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getAllJobsAdmin = async (_req: Request, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        company: true,
        postedBy: { select: { email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(jobs);
    return;
  } catch (error) {
    console.error("Admin Get Jobs Error:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
    return;
  }
};


export const getAllUsersAdmin = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        profileComplete: true,
      },
    });

    res.status(200).json(users);
    return;
  } catch (error) {
    console.error("Admin Get Users Error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
    return;
  }
};



export const adminStats = async (_req: Request, res: Response) => {
  try {
    const [jobs, users, applications, fraud] = await Promise.all([
      prisma.job.count(),
      prisma.user.count(),
      prisma.jobApplication.count(),
      prisma.job.count({
        where: { mlFraudProbability: { gt: 0.7 } },
      }),
    ]);

    res.status(200).json({ jobs, users, applications, fraud });
    return;

  } catch (error) {
    console.error("Admin Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch admin stats" });
    return;
  }
};

