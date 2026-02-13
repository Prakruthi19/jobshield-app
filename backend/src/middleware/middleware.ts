import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

export type AuthRequest = Request & { 
  user?: { id: string; role: string };
  admin?: any;
  role?: string;
  authType?: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
      admin?: any;
      role?: string;
      authType?: string;
    }
  }
}


export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "Missing token" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing");

  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    if (decoded.role === "ADMIN") {
      const admin = await prisma.admin.findUnique({
        where: { id: decoded.id }
      });

      if (!admin) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      req.user = { id: admin.id, role: "ADMIN" };
    } else {
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });

      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      req.user = { id: user.id, role: user.role || "USER" };
    }

    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized: No user context" });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        message: `Forbidden: Requires one of roles [${allowedRoles.join(", ")}]`,
      });
      return;
    }

    next();
  };
};

export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) : void => {
  if (!req.user || req.user.role !== "ADMIN") {
    res.status(403).json({ message: "Admin access required" });
    return;
  }
  next();
};
