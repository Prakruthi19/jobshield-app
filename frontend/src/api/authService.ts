import api from "./api";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
// User registration
export const registerUser = (data: any) => {
  return api.post("/api/auth/register", data);
};
export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
    const idToken = await userCredential.user.getIdToken();

    console.log("ID Token:", idToken);
    
    const response = await api.post(
      "/api/auth/login",
       { 
          email: data.email,      // your email variable
          password: data.password // your password variable
        },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    return response.data;
  } catch (err: any) {
    console.error("Login failed:", err);
    throw err;
  }
};

export const getUserPhone = (data: any)=> {
   return api.get("/api/auth/:userId/phone", data);

}