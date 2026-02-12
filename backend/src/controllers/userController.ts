import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export type AuthRequest = Request & { user?: { id: string; role: string } };
export const getUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
            },
        });
           if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (err) {
        console.error("Get Profile Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { firstName, lastName, phone } = req.body;   

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { firstName, lastName, phone },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                profileComplete: true,
            },
        });
    let finalUser = updatedUser;


    if (!updatedUser.profileComplete) {

      const isProfileComplete =
        Boolean(updatedUser.firstName?.trim()) &&
        Boolean(updatedUser.lastName?.trim()) &&
        Boolean(updatedUser.phone?.trim());
      if (isProfileComplete) {
        finalUser = await prisma.user.update({
          where: { id: userId },
          data: { profileComplete: true },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            profileComplete: true,
          },
        });
      }
    }

        return res.status(200).json({ message: "Profile updated successfully", user: finalUser });
    }

    catch (err) {
        console.error("Update Profile Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
