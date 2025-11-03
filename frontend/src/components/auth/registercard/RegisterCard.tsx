import React, { useState } from "react";
import "./RegisterCard.scss";
import { toast } from "react-hot-toast";
import { UserPlus } from "lucide-react";
import { registerUser } from "../../../api/authService";
import { useNavigate } from "react-router-dom";
interface UserRegisterProps {
  title?: string;
  subtitle?: string;
  themeColor: string;
  role: string;
}

const UserRegister: React.FC<UserRegisterProps> = ({ title, subtitle, themeColor, role }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role : role
   
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const navigate = useNavigate();
     try {
    const result = await registerUser(formData);
    console.log("User Registered:", result);
    toast.success(result.data.message || "Registration successful!");

    // 2️⃣ Save token for authentication
    localStorage.setItem("token", result.data.token);

    // 3️⃣ Optionally save user info
    localStorage.setItem("user", JSON.stringify(result.data.user));

    setTimeout(() => {
      navigate("/dashboard/user"); // React Router
    }, 1500);
  } catch (error: any) {
    console.error("Registration failed:", error.response?.data || error.message);
    // Error toast using API error message
    const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
    toast.error(errorMessage);
    // Optional: show error notification
  }
  };

  return (
    <div className="user-register-card">
         <div className="icon-container">
        <UserPlus  color="var(--primary-color)" /> 
      </div>
      <h2 className="title">{title}</h2>
      <p className="subtitle">{subtitle}</p>

      <form onSubmit={handleSubmit}>
        <div className="input-row" style={{ display: 'flex', gap: '1rem' }}>
          <div className="input-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
        </div>
          <div className="input-group" style={{ flex: 1 }}>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          </div>
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="register-btn">
          Register
        </button>
      </form>

      <p className="login-link">
        Already have an account? <a href="/login/auth/user/" style={{ color: themeColor }}>Login</a>
      </p>
    </div>
  );
};

export default UserRegister;
