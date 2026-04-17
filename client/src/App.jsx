import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { useAuth } from "./Provider/AuthContext";
import LoginForm from "./Container/LoginPage.jsx";
import SignUp from "./Container/SignUp.jsx";
import { RequisitionProvider } from "./Provider/RequisitionContext.jsx";
import SecondHome from "./Container/SecondHome.jsx";
import Procured from "./Container/Procured.jsx";
import ThirdHome from "./Container/ThirdHome.jsx";
import HistoryCard from "./Container/HistoryCard.jsx";
import Notification from "./Container/Notification.jsx";
import ApprovalsforRequest from "./Container/ApprovalsforRequest.jsx";
import UserManagementDashboard from "./Container/UserManagementDashboard.jsx";
import BudgetManagement from "./Container/BudgetManagement.jsx";
import RequisitionsRequest from "./Container/Requisitions.jsx";
import RequisitionDetails from "./Container/Requisitions/RequisitionDetails.jsx";


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
    <RequisitionProvider>
    <ChakraProvider>
      <BrowserRouter>
      <Routes>

         {/* Public Routes */}
          <Route path="/" element={<PublicRoute element={<LoginForm />} />} />
          
          <Route
            path="/signup"
            element={<PublicRoute element={<SignUp />} />}
          />

          <Route
            path="/Dashboard"
            element={<ProtectedRoute element={<SecondHome />} />}
          />

          <Route
            path="/Procured"
            element={<ProtectedRoute element={<Procured />} />}
          />

          <Route
            path="/:roomNumber"
            element={<ProtectedRoute element={<ThirdHome />} />}
          />

          <Route
            path="/:roomNumber/:Dsr_No"
            element={<ProtectedRoute element={<HistoryCard />} />}
          />

          <Route
            path="/Notification"
            element={
              <ProtectedRoute
                element={<Notification />}
                allowedRoles={["HOD", "Lab_Incharge"]} 
              />
            }
            />

            <Route
            path="/ApprovalsforRequest"
            element={
              <ProtectedRoute
                element={<ApprovalsforRequest />}
                allowedRoles={["Staff", "Lab_Incharge"]} 
              />
            }
            />
  
          <Route
            path="/UserManagementDashboard"
            element={
              <ProtectedRoute
                element={<UserManagementDashboard />}
                allowedRoles={["HOD", "Principal"]} 
              />
            }
            />

            <Route
            path="/BudgetManagement"
            element={
              <ProtectedRoute
                element={<BudgetManagement />}
                allowedRoles={["DSR_Incharge"]} 
              />
            }
          />

            <Route
            path="/RequisitionsRequest"
            element={
              <ProtectedRoute
                element={<RequisitionsRequest />}
                allowedRoles={["Central_DSR_Incharge", "Lab_Assistance" , "DSR_Incharge" , "HOD",
              "Lab_Incharge",]}
              />
            }
            />

            <Route
            path="/requisition/:id"
            element={
              <ProtectedRoute
                element={<RequisitionDetails />}
                allowedRoles={["Central_DSR_Incharge", "Lab_Assistance" , "DSR_Incharge" , "HOD",
              "Lab_Incharge",]} 
              />
            }
          />

      </Routes>
      </BrowserRouter>
    </ChakraProvider>
    </RequisitionProvider>
  );
}

export default App;