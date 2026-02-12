import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export const authenticate = (req: Request, res: Response, next: NextFunction) => {
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

    // attach user to request
    (req as any).user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
    return;
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
