import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Heading,
  Spinner,
  Text,
  Button,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

function StaffRequest() {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const fetchRequisitions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      }
      const response = await axios.get(
        "http://localhost:5000/approver-requests",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log(response);
      setRequisitions(response.data);
    } catch (err) {
      console.error("Error fetching requisitions:", err);
      setError("Failed to fetch requisitions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequisitions();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/approve/${id}`,

        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Requisition Approved",
        description: "The requisition has been approved successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setRequisitions((prev) => prev.filter((req) => req._id !== id));
    } catch (err) {
      console.error("Error approving requisition:", err);
      toast({
        title: "Approval Failed",
        description: "Failed to approve requisition. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleView = (req) => {
    navigate(`/requisition/${req._id}`, { state: req });
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={10}>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading mb={4}>Requisitions List</Heading>
      <Box
        overflowX="auto"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        bg="white"
      >
        <Table size="sm" variant="unstyled" width="full">
          <Thead>
            <Tr bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
              <Th px="4" py="3">
                Requisition Number
              </Th>
              <Th px="4" py="3">
                Date
              </Th>
              <Th px="4" py="3">
                From (Department)
              </Th>
              <Th px="4" py="3">
                To (Purchase Officer)
              </Th>
              <Th px="4" py="3">
                Reference
              </Th>
              <Th px="4" py="3">
                Requester Name
              </Th>
              <Th px="4" py="3">
                Requester Email
              </Th>
              <Th px="4" py="3">
                Actions
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {requisitions.map((req) => (
              <Tr key={req._id} borderBottom="1px solid" borderColor="gray.100">
                <Td px="4" py="4">
                  {req.generalDetails.requisitionNumber}
                </Td>
                <Td px="4" py="3">
                  {new Date(req.generalDetails.date).toLocaleDateString()}
                </Td>
                <Td px="4" py="2">
                  {req.generalDetails.from}
                </Td>
                <Td px="4" py="2">
                  {req.generalDetails.to}
                </Td>
                <Td px="4" py="2">
                  {req.generalDetails.reference}
                </Td>
                <Td px="4" py="2">
                  {req.generalDetails.requesterName}
                </Td>
                <Td px="4" py="2">
                  {req.generalDetails.requesterEmail}
                </Td>
                <Td px="4" py="2">
                  <Box display="flex" gap={2}>
                    <Button
                      leftIcon={<ViewIcon />}
                      colorScheme="blue"
                      size="sm"
                      onClick={() => handleView(req)}
                    >
                      View
                    </Button>
                    {(userRole === "Central_DSR_Incharge" ||
                      userRole === "DSR_Incharge" ||
                      userRole === "Lab_Incharge" ||
                      userRole === "HOD") && (
                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={() => handleApprove(req._id)}
                      >
                        Approve
                      </Button>
                    )}
                  </Box>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default StaffRequest;
