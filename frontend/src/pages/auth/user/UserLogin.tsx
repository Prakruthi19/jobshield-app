import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./user-login.scss";
import { googleLogin, loginUser } from "../../../api/authService";
import toast from "react-hot-toast";
import type { GoogleAuthResponse } from "../../../types/auth";
import SHA256 from "crypto-js/sha256";
import { ArrowLeft } from "lucide-react";
import LoginCard from "../../../components/auth/logincard/LoginCard";
import useGoogleScript from "../../../hooks/useGoogleScript";
const UserLogin: React.FC = () => {
   const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async () => {
  console.log("Login submitted:", { email, password });

  // Hash password before sending
  const hashedPassword = SHA256(password).toString();

  setLoading(true);

  try {
    const res = await loginUser({
      email,
      password: hashedPassword,  // MUST be 'password' key
    });
        // Store token & user details
    sessionStorage.setItem("accessToken", res.data.token);
    sessionStorage.setItem("userRole", res.data.role);
    sessionStorage.setItem("userId", res.data.userId);
    sessionStorage.setItem("userName", res.data.userName);
    sessionStorage.setItem("userEmail", res.data.userEmail);
    if (res.data.role !== "JOBSEEKER") {
      toast.error("Access denied. You must log in as a jobseeker.");
      return;
    }
      // Redirect
      setTimeout(() => {
        navigate("/dashboard/user");
      }, 1500);

    toast.success("User Login Successful");



    console.log("Logged in user:", res.data);

  } catch (err: any) {
    console.error("Login error:", err);
    toast.error(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

   const handleCredentialResponse  = async (credentialResponse: any) => {
    try {
     if (!credentialResponse?.credential) {
      toast.error("Google authentication failed");
      return;
    }

       const res: GoogleAuthResponse = await googleLogin(
      credentialResponse.credential,
      "JOBSEEKER"
    );
       if (res.role !== "JOBSEEKER") {
      toast.error("Access denied. You must log in as a jobseeker.");
      return;
    }
      // Store token & user details
      sessionStorage.setItem("accessToken", res.token);
      sessionStorage.setItem("userRole", res.role);
      sessionStorage.setItem("userId", res.userId);
      sessionStorage.setItem("userName", res.userName);
      sessionStorage.setItem("userEmail", res.userEmail);
       if (!res.profileComplete) {
       toast.success("Welcome! Please complete your profile in the Profile Section");
        setTimeout(() => navigate("/dashboard/user?tab=profile"), 1500);
        return;
    }
      toast.success();
        setTimeout(() => {
        navigate("/dashboard/user");
      }, 1500);
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

useGoogleScript(import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_CLIENT_ID || "", handleCredentialResponse);
const handleCustomSignIn = () => {
      if (window.google && window.google.accounts?.id?.prompt) {
        window.google.accounts.id.prompt();
      }
    };

  return (
    <div className="login-page">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

  <div className="login-container">
    <LoginCard
      title="User Login"
      loading={loading}
      username={email}
      password={password}
      onUsernameChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleLogin}
      themeColor="var(--primary-color)"
      signUpLink="/register/auth/user/"  
    />

    <div className="divider">
      <span>or</span>
    </div>

    <div className="google-wrapper">
      <button className="google-btn" onClick={handleCustomSignIn}>
    <img
      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
      alt="google"
      className="google-icon"
    />
    <span>Continue with Google</span>
  </button>
    </div>
  </div>
</div>

  );
};

export default UserLogin;
