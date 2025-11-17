import React, { useState } from "react";
import "./RegisterCard.scss";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";

interface UserRegisterProps {
  title?: string;
  subtitle?: string;
  themeColor?: string;
  role: string;
  onSubmitData: (formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    phone: string;
  }) => void;
  loading: boolean;
}

const UserRegister: React.FC<UserRegisterProps> = ({ 
  title, 
  subtitle, 
  themeColor = "var(--primary-color)", 
  role,
  onSubmitData, 
  loading 
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: role
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match!");
    return;
  }
    onSubmitData({
    ...formData,
  });
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
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
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

        <button type="submit" className="register-btn"  disabled={loading} >
           {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="login-link">
        Already have an account? <a href="/login/auth/user/" style={{ color: themeColor }}>Login</a>
      </p>
    </div>
  );
};

export default UserRegister;
