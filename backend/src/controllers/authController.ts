import { Request, Response } from 'express';
import { admin } from "../lib/firebaseAdmin"; 
import prisma from './../config/prisma';
import { verifyIdToken } from "../lib/firebaseAdmin";
// Register
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone, role} = req.body;

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const firebaseUser = await admin.auth().createUser({
      email,
      password,
    });

    await admin.auth().setCustomUserClaims(firebaseUser.uid, { role });


     const newUser = await prisma.user.create({
      data: {
        firebaseUid: firebaseUser.uid,
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        role: role ? role : undefined, // optional
      },
    });
     return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }

};

// Login
export const login = async (req: Request, res: Response) => {
  try {

    const authHeader = req.headers.authorization; // Express style
    console.log(authHeader);
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Invalid token format" });

    const decodedToken = await verifyIdToken(token);
    const uid = decodedToken.uid;
    console.log(uid)
    console.log("<<<<<<<Token Verified>>>>>>>>>>");

    console.log("Request Body ", req);

    console.log("USER ROLE>>>>>>>>>>>>>>>>", decodedToken.role);
    const {email} = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
     return res.json({
      message: "Login successful",
      token, // Firebase ID token
      user: {
        id: user?.id,
        // firebaseUid: user.firebaseUid,
        email: user?.email,
        name: user?.firstName,
        role: user?.role
      },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
};


// GET /api/users/:userId/phone
export const getUserPhone =  async (req: Request, res : Response) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true },
    });

    if (!user || !user.phone) {
      return res.status(404).json({ error: "Phone number not found" });
    }

    // Mask all but last 4 digits
    const phoneStr = user.phone.toString(); // convert number → string
    const maskedPhone = phoneStr.replace(/\d(?=\d{4})/g, "*");
  

    return res.json({ phone: maskedPhone });
  } catch (err) {
    console.error(err);
   return  res.status(500).json({ error: "Server error" });
  }
};
 
export const demo = (_req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Demo API is working!",
      data: {
        timestamp: new Date(),
        info: "This is a test endpoint",
      },
    });
  } catch (error) {
    console.error("Demo API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};