import React, { useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Layers, Users, ClipboardList, CheckCircle } from "lucide-react";

const SignUp = () => {
  const [userdata, setUserdata] = useState({
    username: "",
    email: "",
    password: "",
    DepartmentId: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleInput = (event) => {
    const { value, name } = event.target;
    setUserdata((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/Register`,
        userdata,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        const msg = response.data?.msg || "Your account is pending HOD approval.";
        setSuccessMessage(msg);
        toast({
          title: "Account Created!",
          description: msg,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        console.log("User created:", response.data);
        setUserdata({ username: "", email: "", password: "", DepartmentId: "" });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        const msg = "Something went wrong. Please try again.";
        setErrorMessage(msg);
        toast({
          title: "Error",
          description: msg,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Sign-up failed:", error.response?.data || error.message);
      const msg = error.response?.data?.msg || "Sign-up failed. Please try again.";
      setErrorMessage(msg);
      toast({
        title: "Sign-up Failed",
        description: msg,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const featureItems = [
    { icon: <Users size={16} />, text: "Multi-role access management" },
    { icon: <ClipboardList size={16} />, text: "Equipment requisition workflow" },
    { icon: <CheckCircle size={16} />, text: "HOD-verified onboarding" },
  ];

  return (
    <div className="signup_wrapper">
      {/* Left — Brand Panel */}
      <div className="signup_brand_panel">
        <div className="signup_brand_logo">
          <div className="signup_brand_logo_icon">
            <Layers size={18} />
          </div>
          <span className="signup_brand_logo_name">PICTLab</span>
        </div>

        <div className="signup_brand_content">
          <div className="signup_brand_badge">✦ Join the Platform</div>
          <h1 className="signup_brand_title">
            Get started in minutes
          </h1>
          <p className="signup_brand_subtitle">
            Create your account and wait for HOD verification to access your
            role-based dashboard.
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
      <div className="signup_form_panel">
        <motion.div
          className="SignUp_form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="signup_form_header">
            <h2 className="signup_form_title">Create your account</h2>
            <p className="signup_form_subtitle">
              Fill in the details below to get started
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {errorMessage && (
              <div style={{ marginBottom: 16, padding: "12px 14px", background: "var(--color-danger-bg, #fef2f2)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "var(--radius-md)", color: "var(--color-danger, #dc2626)", fontSize: 13, fontWeight: 500 }}>
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div style={{ marginBottom: 16, padding: "12px 14px", background: "var(--color-success-bg, #ecfdf5)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "var(--radius-md)", color: "var(--color-success, #059669)", fontSize: 13, fontWeight: 500 }}>
                {successMessage}
              </div>
            )}

            <div className="input_box">
              <label htmlFor="username">Full Name</label>
              <input
                type="text"
                name="username"
                id="username"
                value={userdata.username}
                placeholder="Your full name"
                required
                autoComplete="username"
                onChange={handleInput}
              />
            </div>

            <div className="input_box">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                name="email"
                id="email"
                value={userdata.email}
                placeholder="you@pict.edu"
                required
                autoComplete="email"
                onChange={handleInput}
              />
            </div>

            <div className="input_box">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={userdata.password}
                placeholder="Create a strong password"
                required
                onChange={handleInput}
              />
            </div>

            <div className="input_box">
              <label htmlFor="DepartmentId">Department</label>
              <select
                name="DepartmentId"
                id="DepartmentId"
                value={userdata.DepartmentId}
                onChange={handleInput}
                required
                style={{
                  width: "100%",
                  height: 44,
                  padding: "0 14px",
                  fontSize: 14,
                  fontFamily: "var(--font-sans)",
                  color: userdata.DepartmentId ? "var(--text-primary)" : "var(--text-tertiary)",
                  background: "#f8fafc",
                  border: "1.5px solid var(--surface-border)",
                  borderRadius: "var(--radius-md)",
                  outline: "none",
                  cursor: "pointer",
                  transition: "border-color 150ms ease, box-shadow 150ms ease",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 14px center",
                  paddingRight: 38,
                }}
              >
                <option value="">Select Department</option>
                <option value="ENTC">ENTC</option>
                <option value="CS">CS</option>
                <option value="IT">IT</option>
              </select>
            </div>

            <button type="submit" className="button" disabled={loading}>
              {loading ? (
                <>
                  <span style={{
                    width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff", borderRadius: "50%",
                    display: "inline-block", animation: "spin 0.6s linear infinite"
                  }} />
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="sign_up">
              Already have an account?{" "}
              <Link to="/">Sign in</Link>
            </p>
          </form>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        select:focus {
          background-color: #ffffff !important;
          border-color: var(--color-primary) !important;
          box-shadow: 0 0 0 3px var(--color-primary-bg) !important;
        }
      `}</style>
    </div>
  );
};

export default SignUp;
