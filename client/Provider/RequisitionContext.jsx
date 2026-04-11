import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useAuth } from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import { validateRequisitionForm } from "./requisitionValidation";

const RequisitionContext = createContext();

export const useRequisition = () => useContext(RequisitionContext);

export const RequisitionProvider = ({ children }) => {
  const toast = useToast();
  const { token } = useAuth();

  const [requisitionData, setRequisitionData] = useState({
    generalDetails: {
      requisitionNumber: "",
      date: "2025-03-04",
      to: "Procurement Department",
      from: "IT",
      reference: "Internal Request",
      requesterName: "",
      requesterEmail: "",
      requesterPhone: "",
      requesterRole: "",
      roomNo: "",
      approverName: "",
      approverEmail: "",
      approverRole: "Subject Teacher",
      category: "Equipment",
    },
    items: [],
    approval: {
      SanctionBudget: 0,
      BalanceAmount: 0,
      ApproximateAmount: 0,
      AmountSpent: 0,
      additionalNotes: "",
      attachment: undefined,
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken) {
          setRequisitionData((prev) => ({
            ...prev,
            generalDetails: {
              ...prev.generalDetails,
              requesterEmail:
                decodedToken.email || prev.generalDetails.requesterEmail,
              requesterName:
                decodedToken.username || prev.generalDetails.requesterName,
              requesterRole:
                decodedToken.role || prev.generalDetails.requesterRole,
              roomNo: decodedToken.labId || prev.generalDetails.roomNo,
              from: decodedToken.departmentId || prev.generalDetails.from,
            },
          }));
        }
      } catch (error) {
        console.error("Token decode error:", error);
      }
    }
  }, [token]);

  const updateGeneralDetails = useCallback((details) => {
    setRequisitionData((prev) => ({
      ...prev,
      generalDetails: {
        ...prev.generalDetails,
        ...details,
      },
    }));
  }, []);

  const updateItems = useCallback((items) => {
    setRequisitionData((prev) => ({
      ...prev,
      items,
    }));
  }, []);

  const updateApproval = useCallback((approval) => {
    setRequisitionData((prev) => ({
      ...prev,
      approval: { ...prev.approval, ...approval },
    }));
  }, []);

  const getApproval = useCallback(
    () => requisitionData.approval,
    [requisitionData]
  );

  const resetRequisition = useCallback(() => {
    setRequisitionData({
      generalDetails: {
        requisitionNumber: "",
        date: "2025-03-04",
        to: "Procurement Department",
        from: "IT",
        reference: "Internal Request",
        requesterName: "",
        requesterEmail: "",
        requesterPhone: "",
        requesterRole: "",
        roomNo: "",
        approverName: "",
        approverEmail: "",
        approverRole: "Subject Teacher",
        category: "Equipment",
      },
      items: [],
      approval: {
        SanctionBudget: 0,
        BalanceAmount: 0,
        ApproximateAmount: 0,
        AmountSpent: 0,
        additionalNotes: "",
        attachment: undefined,
      },
    });
  }, []);

  const handleSubmit = async () => {
    if (!validateRequisitionForm(requisitionData, toast)) return;
    console.log("Submitting data:", requisitionData);
    setLoading(true);
    try {
      const itemsWithTotalPrice = requisitionData.items.map((item) => ({
        ...item,
        totalPrice: item.qty * parseFloat(item.unitPrice) || 0,
      }));

      const updatedRequisitionData = {
        ...requisitionData,
        items: itemsWithTotalPrice,
      };

      const response = await axios.post(
        "http://localhost:5000/submit",
        updatedRequisitionData,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000,
          withCredentials: true,
        }
      );

      console.log("Response:", response.data);
      toast({
        title: "Submission Successful",
        description: "Your requisition has been submitted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      resetRequisition();
      window.location.reload();
    } catch (error) {
      console.error("Submission error:", error.response?.data || error);
      const errorMessage =
        error.response &&
        error.response.data &&
        typeof error.response.data === "object"
          ? JSON.stringify(error.response.data)
          : error.response?.data ||
            error.message ||
            "There was an error submitting your requisition.";
      toast({
        title: "Submission Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    requisitionData,
    updateGeneralDetails,
    updateItems,
    updateApproval,
    getApproval,
    resetRequisition,
    handleSubmit,
    loading,
  };

  return (
    <RequisitionContext.Provider value={value}>
      {children}
    </RequisitionContext.Provider>
  );
};
