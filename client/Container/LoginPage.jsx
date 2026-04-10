import React, { useState } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Provider/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useToast } from "@chakra-ui/react";

const LoginForm = () => {
  const { Login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [userdata, setUserdata] = useState({ email: "", password: "" });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setUserdata((prev) => ({ ...prev, [name]: value }));
  };

  const HandleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/Login",
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
          description: `Role: ${role}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setUserdata({ email: "", password: "" });
        navigate("/Dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
      toast({
        title: "Login Failed",
        description: "Login failed. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="login_wrapper">
      <div className="login_form">
        <form action="#" onSubmit={HandleSubmit}>
          <h3 className="font-[600] text-xl">Log in with</h3>

          <div className="input_box">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={userdata.email}
              onChange={handleInput}
              id="email"
              placeholder="Enter email address"
              required
            />
          </div>
          <div className="input_box">
            <div className="password_title">
              <label htmlFor="password">Password</label>
              <p className="text-sm"> Forgot Password?</p>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={userdata.password}
              onChange={handleInput}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="button">
            Log In
          </button>

          <p className="sign_up">
            Don't have an account? <Link to="/SignUp">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
