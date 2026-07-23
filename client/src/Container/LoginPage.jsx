import React, { useState } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Provider/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Layers, ShieldCheck, BarChart3 } from "lucide-react";

const LoginForm = () => {
  const { Login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [userdata, setUserdata] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInput = (event) => {
    const { name, value } = event.target;
    setUserdata((prev) => ({ ...prev, [name]: value }));
  };

  const HandleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/Login`,
        userdata,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        const token = response.data.token;
        const decodedToken = jwtDecode(token);
        const role = decodedToken.role;

        Login(token);

        toast({
          title: "Login Successful",
          description: `Welcome back! Role: ${role}`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setUserdata({ email: "", password: "" });
        navigate("/Dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
      const msg = err.response?.data?.msg || "Invalid email or password. Please try again.";
      setErrorMessage(msg);
      toast({
        title: "Login Failed",
        description: msg,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const featureItems = [
    { icon: <Layers size={16} />, text: "Centralized deadstock tracking" },
    { icon: <ShieldCheck size={16} />, text: "Role-based access control" },
    { icon: <BarChart3 size={16} />, text: "Real-time allocation stats" },
  ];

  return (
    <div className="login_wrapper">
      {/* Left — Brand Panel */}
      <div className="login_brand_panel">
        <div className="login_brand_logo">
          <div className="login_brand_logo_icon">
            <Layers size={18} />
          </div>
          <span className="login_brand_logo_name">PICTLab</span>
        </div>

        <div className="login_brand_content">
          <div className="login_brand_badge">
            ✦ Deadstock Management System
          </div>
          <h1 className="login_brand_title">
            Manage lab assets with precision
          </h1>
          <p className="login_brand_subtitle">
            Track, allocate, and manage your institution's deadstock inventory
            with a unified, role-aware platform.
          </p>
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
            {featureItems.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.85)", fontSize: 14 }}>
                <span style={{ color: "rgba(255,255,255,0.6)" }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          © {new Date().getFullYear()} PICT. All rights reserved.
        </p>
      </div>

      {/* Right — Form Panel */}
      <div className="login_form_panel">
        <motion.div
          className="login_form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="login_form_header">
            <h2 className="login_form_title">Sign in to PICTLab</h2>
            <p className="login_form_subtitle">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <form onSubmit={HandleSubmit}>
            {errorMessage && (
              <div style={{ marginBottom: 16, padding: "12px 14px", background: "var(--color-danger-bg, #fef2f2)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "var(--radius-md)", color: "var(--color-danger, #dc2626)", fontSize: 13, fontWeight: 500 }}>
                {errorMessage}
              </div>
            )}

            <div className="input_box">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                name="email"
                id="email"
                value={userdata.email}
                onChange={handleInput}
                placeholder="you@pict.edu"
                required
                autoComplete="email"
              />
            </div>

            <div className="input_box">
              <div className="password_title">
                <label htmlFor="password">Password</label>
                <span className="forgot_link">Forgot password?</span>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={userdata.password}
                  onChange={handleInput}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-tertiary)",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span style={{
                    width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff", borderRadius: "50%",
                    display: "inline-block", animation: "spin 0.6s linear infinite"
                  }} />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <p className="sign_up">
              Don't have an account?{" "}
              <Link to="/SignUp">Create one</Link>
            </p>
          </form>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
