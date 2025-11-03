import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginCard from "../../../components/auth/logincard/LoginCard";
import "./user-login.scss";
import { loginUser } from "../../../api/authService";
import toast from "react-hot-toast";

const UserLogin: React.FC = () => {
   const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const result = await loginUser(form);
      console.log("Login submitted:", form);
      toast.success(result.data.message || "Login successful!");
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
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        themeColor="var(--primary-color)"
      />
    </div>
  );
};

export default UserLogin;
