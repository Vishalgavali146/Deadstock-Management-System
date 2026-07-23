import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Box, Heading, Spinner, Text, Button, useToast,
  Table, Thead, Tbody, Tr, Th, Td,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

function RequisitionsRequest() {
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
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/RequisitionsRequest`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log(response);
      setRequisitions(response.data);
    } catch (err) {
      console.error("Error fetching requisitions:", err);
      setError("Failed to fetch requisitions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequisitions(); }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/requisitions/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        title: "Requisition Approved",
        description: "The requisition has been approved successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
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
        position: "top-right",
      });
    }
  };

  const handleView = (req) => {
    navigate(`/requisition/${req._id}`, { state: req });
  };

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minH="300px">
        <Spinner size="lg" color="purple.500" thickness="3px" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={10} p={6}>
        <Text color="red.500" fontWeight="500">{error}</Text>
      </Box>
    );
  }

  const thStyle = { fontSize: "10px", textTransform: "uppercase", letterSpacing: "wider", color: "gray.500", fontWeight: "600", py: 3 };

  return (
    <Box p={6}>
      <Box mb={5}>
        <Heading size="md" color="gray.800" mb={1}>My Requisitions</Heading>
        <Text fontSize="sm" color="gray.500">{requisitions.length} requisition{requisitions.length !== 1 ? "s" : ""}</Text>
      </Box>

      <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="sm" overflow="hidden">
        <Table size="sm" variant="unstyled">
          <Thead bg="gray.50" borderBottom="1px solid" borderColor="gray.100">
            <Tr>
              <Th {...thStyle}>Req. Number</Th>
              <Th {...thStyle}>Date</Th>
              <Th {...thStyle}>From (Dept)</Th>
              <Th {...thStyle}>To (Purchase)</Th>
              <Th {...thStyle}>Reference</Th>
              <Th {...thStyle}>Requester</Th>
              <Th {...thStyle}>Email</Th>
              <Th {...thStyle} textAlign="center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {requisitions.length > 0 ? (
              requisitions.map((req) => (
                <Tr key={req._id} borderBottom="1px solid" borderColor="gray.50" _hover={{ bg: "gray.50" }} transition="background 0.15s">
                  <Td px={4} py={3} fontWeight="500" fontSize="sm" color="gray.800">{req.generalDetails.requisitionNumber}</Td>
                  <Td px={4} py={3} fontSize="sm" color="gray.600">{new Date(req.generalDetails.date).toLocaleDateString()}</Td>
                  <Td px={4} py={3} fontSize="sm" color="gray.600">{req.generalDetails.from}</Td>
                  <Td px={4} py={3} fontSize="sm" color="gray.600">{req.generalDetails.to}</Td>
                  <Td px={4} py={3} fontSize="sm" color="gray.600">{req.generalDetails.reference}</Td>
                  <Td px={4} py={3} fontSize="sm" color="gray.700" fontWeight="500">{req.generalDetails.requesterName}</Td>
                  <Td px={4} py={3} fontSize="sm" color="gray.500">{req.generalDetails.requesterEmail}</Td>
                  <Td px={4} py={3}>
                    <Box display="flex" gap={2} justifyContent="center">
                      <Button leftIcon={<ViewIcon />} colorScheme="purple" size="xs" variant="ghost" borderRadius="lg" onClick={() => handleView(req)} _hover={{ bg: "purple.50" }}>
                        View
                      </Button>
                      {(userRole === "Central_DSR_Incharge" || userRole === "DSR_Incharge" || userRole === "Lab_Incharge" || userRole === "HOD") && (
                        <Button colorScheme="green" size="xs" borderRadius="lg" onClick={() => handleApprove(req._id)}>
                          Approve
                        </Button>
                      )}
                    </Box>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={8} textAlign="center" py={16}>
                  <Text fontSize="sm" fontWeight="500" color="gray.400">No requisitions found</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default RequisitionsRequest;
