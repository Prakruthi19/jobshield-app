import { useState } from "react";
import "./AdminAuth.scss";
import { EyeOff,  Eye } from "lucide-react";
import api from "../../../api/api";
import { adminEnter } from "../../../api/authService";
import toast from "react-hot-toast";


export default function AdminAuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    secretKey: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/admin/login" : "/admin/register";
      const res = await adminEnter(endpoint, form);
      toast.success(res.data.message, { duration: 2000 });
      sessionStorage.setItem("accessToken", res.data.token);

      window.location.href = "/dashboard/admin";

    } catch (err: any) {
      setError(err?.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth">
      <div className="card">
        <h2>{mode === "login" ? "Admin Login" : "Admin Register"}</h2>
        <form onSubmit={submit}>
          <input
            name="email"
            type="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div className="password-field">
          <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
          <span
            className="eye"
            onClick={() => setShowPassword(prev => !prev)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
          {mode === "register" && (
            <div className="password-field">
            <input
              name="secretKey"
              type="password"
              placeholder="Admin Secret Key"
              value={form.secretKey}
              onChange={handleChange}
              required
            />
            <span
            className="eye"
            onClick={() => setShowPassword(prev => !prev)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
          )}
          {error && <p className="error">{error}</p>}

          <button disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Admin"}
          </button>
        </form>

        <p className="toggle">
          {mode === "login" ? "No admin account?" : "Already admin?"}
          <span onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? " Register" : " Login"}
          </span>
        </p>

      </div>
    </div>
  );
}
