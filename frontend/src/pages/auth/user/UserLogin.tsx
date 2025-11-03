import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginCard from "../../../components/auth/logincard/LoginCard";
import "./user-login.scss";

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
      // Replace with your API call
      // const res = await axios.post("/api/auth/login", form);
      console.log("Login submitted:", form);

      // Navigate to user dashboard
      navigate("/dashboard/user");
    } catch (err) {
      console.error(err);
      alert("Login failed. Please check your credentials.");
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
