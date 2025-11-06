import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./logincard.scss";

type Props = {
  title: string;
  themeColor?: string;
  loading?: boolean;
  onSubmitData: (formData: { email: string; password: string }) => void;
};

const LoginCard: React.FC<Props> = ({
  title,
  themeColor = "var(--primary-color)",
  loading = false,
  onSubmitData,
}) => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitData(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2 className="login-title" style={{ color: themeColor }}>
        {title}
      </h2>

      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        type="email"
        placeholder="Email"
        className="login-input"
        required
      />

      <input
        name="password"
        value={formData.password}
        onChange={handleChange}
        type="password"
        placeholder="Password"
        className="login-input"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="login-button"
        style={{ backgroundColor: themeColor }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="login-links">
        <Link to="/reset-password" style={{ color: themeColor }}>
          Forgot password?
        </Link>
      </div>

      <div className="signup-text">
        Don't have an account?{' '}
        <Link to="/register/auth/user/" style={{ color: themeColor }}>
          Sign Up
        </Link>
      </div>
    </form>
  );
};

export default LoginCard;
