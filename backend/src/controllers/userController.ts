import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
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
export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
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
            },
        });
        return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    }

    catch (err) {
        console.error("Update Profile Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
