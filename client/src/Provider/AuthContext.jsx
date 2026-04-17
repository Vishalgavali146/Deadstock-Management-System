import React, { useState, createContext, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const initialAuthState = token ? true : false;
  const initialDecoded = token ? jwtDecode(token) : null;

  const [isAuthenticated, setAuthenticated] = useState(initialAuthState);
  const [decoded, setDecoded] = useState(initialDecoded);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setDecoded(decodedToken);
        setAuthenticated(true);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setDecoded(null);
        setAuthenticated(false);
      }
    }
  }, [token]);

  const Login = (token) => {
    localStorage.setItem("token", token);
    setAuthenticated(true);
    try {
      setDecoded(jwtDecode(token));
    } catch (error) {
      console.error("Failed to decode token:", error);
      setDecoded(null);
    }
  };

  const LogOut = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    setDecoded(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, Login, LogOut, decoded , token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
