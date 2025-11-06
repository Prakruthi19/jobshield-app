"use client";
import { useNavigate } from "react-router-dom";
import UserRegisterCard from "../../../components/auth/registercard/RegisterCard";
import { useState } from "react";
import { registerUser } from "../../../api/authService";
import toast from "react-hot-toast";


const UserRegister: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  }) => {
    setLoading(true);
    
    // Log form data before submission
    console.log("Form Data being submitted:", formData);
  
    try {
      console.log("Submitting registration...");
      const result = await registerUser(formData);
      toast.success(result.data.message || "Register successful!");
      // Navigate to user dashboard
      setTimeout(() => {
        navigate("/dashboard/user"); // React Router
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Register failed. Please try again.";
      console.error(err);
      toast.error(errorMessage);
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
