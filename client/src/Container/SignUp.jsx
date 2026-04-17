import React, { useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const SignUp = () => {
  const [userdata, setUserdata] = useState({
    username: "",
    email: "",
    password: "",
    DepartmentId: "",
  });
  const [loading, setLoading] = useState(false);
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

    try {
      const response = await axios.post(
        "http://localhost:5000/Register",
        userdata,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        toast({
          title: "Sign-up Successful",
          description: "Wait for HOD Approval.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        console.log("User created:", response.data);
        setUserdata({
          username: "",
          email: "",
          password: "",
          DepartmentId: "",
        });
        navigate("/");
      } else {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Sign-up failed:", error.response?.data || error.message);
      toast({
        title: "Sign-up Failed",
        description:
          error.response?.data?.message || "Sign-up failed. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup_wrapper">
      <div className="SignUp_form">
        <form onSubmit={handleSubmit}>
          <h3 className="text-center text-xl font-[600]">Sign Up</h3>

          <div className="input_box">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={userdata.username}
              placeholder="Enter your username"
              required
              autoComplete="username"
              onChange={handleInput}
            />
          </div>

          <div className="input_box">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={userdata.email}
              placeholder="Enter your email"
              required
              autoComplete="email"
              onChange={handleInput}
            />
          </div>

          <div className="input_box">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={userdata.password}
              placeholder="Enter your password"
              required
              onChange={handleInput}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Department
            </label>
            <select
              name="DepartmentId"
              value={userdata.DepartmentId}
              onChange={handleInput}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select</option>
              <option value="ENTC">ENTC</option>
              <option value="CS">CS</option>
              <option value="IT">IT</option>
            </select>
          </div>

          <button type="submit" className="button" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <p className="sign_up text-center">
            Already have an account? <Link to="/">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
