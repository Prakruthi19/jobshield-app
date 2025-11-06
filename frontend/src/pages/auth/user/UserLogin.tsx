import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginCard from "../../../components/auth/logincard/LoginCard";
import "./user-login.scss";
import { loginUser } from "../../../api/authService";
import toast from "react-hot-toast";

const UserLogin: React.FC = () => {
   const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (formData: { email: string; password: string }) => {
    setLoading(true);
  
    try {
      console.log("Login submitted:", formData);
      const result = await loginUser(formData);
 
      toast.success(result.data.message || "Login successful!");
      
      // Store auth token
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      
      // Navigate to user dashboard
    setTimeout(() => {
      navigate("/dashboard/user"); // React Router
    }, 1500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
      console.error(err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-login-page">
      <LoginCard 
        title="User Login"
        loading={loading}
        onSubmitData={handleLogin}
        themeColor="var(--primary-color)"
      />
    </div>
  );
};

export default UserLogin;
