"use client";
import { useNavigate } from "react-router-dom";
import UserRegisterCard from "../../../components/auth/registercard/RegisterCard";
import { useState } from "react";
import { registerUser } from "../../../api/authService";
import toast from "react-hot-toast";
import SHA256 from 'crypto-js/sha256';


const UserRegister: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

const handleRegister = async (formData: {firstName: string, lastName: string, email: string, password: string, confirmPassword: string, role: string}) => {
  setLoading(true);
   if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match");
    setLoading(false);
    return;
  }
  const hashedPassword = SHA256(formData.password).toString();
    const { confirmPassword, ...payloadWithoutConfirm } = formData;

    const payload = {
      ...payloadWithoutConfirm,
      password: hashedPassword, 
    };

  try {
    const result = await registerUser(payload);
    toast.success("Registered!");
    navigate("/dashboard/user");
  } catch (err: any) {
    const message = err.response?.data?.message || "Registration failed";
    toast.error(message);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="register-page">
      <UserRegisterCard 
        title="Create Your Account as a User" 
        subtitle="Join JobShield today and help us detect fake jobs together." 
        themeColor="var(--primary-color)"
        role="JOBSEEKER"
        onSubmitData={handleRegister}
        loading={loading}
      />
    </div>
  );
};

export default UserRegister;
