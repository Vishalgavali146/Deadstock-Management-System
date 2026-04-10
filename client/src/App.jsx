import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";
import { useAuth } from "../Provider/AuthContext";
import LoginForm from "../Container/LoginPage.jsx";
import SignUp from "../Container/SignUp.jsx";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { isAuthenticated, decoded } = useAuth();
  const userRole = decoded?.role; 

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/Dashboard" replace />; 
  }

  return element;
};

const PublicRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/Dashboard" replace />;
  }

  return element;
};

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
      <Routes>

         {/* Public Routes */}
          <Route path="/" element={<PublicRoute element={<LoginForm />} />} />
          
          <Route
            path="/signup"
            element={<PublicRoute element={<SignUp />} />}
          />

      </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;