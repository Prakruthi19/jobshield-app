import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginCard from "../../../components/auth/logincard/LoginCard";
import "./user-login.scss";
import { loginUser } from "../../../api/authService";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode} from "jwt-decode";
import toast from "react-hot-toast";

const UserLogin: React.FC = () => {
   const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    // Handle traditional username/password login
  const handleLogin = async () => {
    console.log("Login submitted:", { email: email, password });
    setLoading(true);

    try {
      // const result = await loginUser({ email: username, password });
      const user = await loginUser({ email, password });
      toast.success("User Login Successful")
       setTimeout(() => {
        navigate("/dashboard/user"); // React Router
      }, 1500);
      console.log("Logged in user:", user);
    } catch (err) {
      console.error("Login error:", err);
    }
    finally {
    setLoading(false); // always run, whether success or error
  }
  };


   const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      console.log("Google user:", decoded);
    } catch (err) {
      console.error("Google login error:", err);
    }
  };
  return (
    <div className="user-login-page">
      <LoginCard 
        title="User Login"
        loading={loading}
        username={email}
        password={password}
        onUsernameChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
        themeColor="var(--primary-color)"
      />
     <div className="text-gray-500 text-sm">or</div>
     <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => console.log("Google Login Failed")}
      />
    </div>
  );
};

export default UserLogin;
