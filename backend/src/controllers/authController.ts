import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;

    // Validate minimal fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const saltedHash = await bcrypt.hash(password, 12);

    // Store in DB
    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        phone,
        role,
        passwordHash: saltedHash,
      },
      select: {
        id: true,
        role: true,
        email: true,
        firstName: true,
        lastName: true,
      }
    });

    // Sign JWT with role for RBAC
    const token = jwt.sign(
      {
        userId: newUser.id,
        role: newUser.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      role: newUser.role,
      userId: newUser.id,
    });

  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body; // SHA256 incoming from FE

    const user = await prisma.user.findUnique({
      where: { email },
        select: {
        id: true,
        firstName: true,
        email: true,
        role: true,
        passwordHash: true,
        provider: true,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.provider === "GOOGLE") {
          return res.status(400).json({
            message: "This account was created using Google. Please continue with Google login.",
            provider: "GOOGLE",
          });
        }
      if (!user.passwordHash) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
    

    return res.json({
      message: "Login successful",
      token,
      userId: user.id,
      role: user.role,
      userName: user.firstName,
      userEmail: user.email,
       provider: user.provider,
    });

  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};



export const logout = async (req: Request, res: Response) => {
  try {
    console.log(`User ${req.user?.id} logged out`);

    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { token, loginType } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Missing Google token" });
    }

   
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
        if (!["EMPLOYER", "JOBSEEKER"].includes(loginType)) {
      return res.status(400).json({ message: "Invalid login type" });
    }
    if (!payload || !payload.email || !payload.sub) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    if (!payload.email_verified) {
      return res.status(401).json({ message: "Google email not verified" });
    }

    const email = payload.email;
    const firstName = payload.given_name || "User";
    const lastName = payload.family_name || "";
    const googleSubId = payload.sub;

    let user;
    let isNewUser = false;

    user = await prisma.user.findUnique({
      where: { googleSubId },
    });

   
    if (!user) {
      const existingEmailUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingEmailUser) {
           if (existingEmailUser.role && existingEmailUser.role !== loginType) {
          return res.status(403).json({
            message: `This account is registered as ${existingEmailUser.role}. Please use the correct login page.`,
          });
        }
        user = await prisma.user.update({
          where: { id: existingEmailUser.id },
          data: {
            googleSubId,
            provider:
              existingEmailUser.provider === "EMAIL"
                ? "EMAIL_GOOGLE"
                : existingEmailUser.provider,
            role: existingEmailUser.role ?? loginType,
          },
        });
      }
    }


    if (!user) {
      isNewUser = true;

      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          googleSubId,
          provider: "GOOGLE",
          role: loginType,
          profileComplete: false,
        },
      });
    }


    const jwtToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return res.json({
      token: jwtToken,
      userId: user.id,
      role: user.role,
      userName: user.firstName,
      userEmail: user.email,
      profileComplete: user.profileComplete,
      isNewUser,
    });

  } catch (err) {
    console.error("Google Auth Error:", err);
    return res.status(500).json({ message: "Google authentication failed" });
  }
};