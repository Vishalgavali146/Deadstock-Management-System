import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Box, Heading, Spinner, Text, Button, useToast,
  Table, Thead, Tbody, Tr, Th, Td,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

function StaffApproval() {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequisitions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          setUserRole(decoded.role);
        }
        const response = await axios.get(
          "http://localhost:5000/getApproverApproval",
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setRequisitions(response.data);
      } catch (err) {
        console.error("Error fetching requisitions:", err);
        setError("Failed to fetch requisitions.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequisitions();
  }, []);

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
        <Heading size="md" color="gray.800" mb={1}>Staff Approvals</Heading>
        <Text fontSize="sm" color="gray.500">{requisitions.length} approved requisition{requisitions.length !== 1 ? "s" : ""}</Text>
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
                  <Td px={4} py={3} textAlign="center">
                    <Button leftIcon={<ViewIcon />} colorScheme="purple" size="xs" variant="ghost" borderRadius="lg" onClick={() => handleView(req)} _hover={{ bg: "purple.50" }}>
                      View
                    </Button>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={8} textAlign="center" py={16}>
                  <Text fontSize="sm" fontWeight="500" color="gray.400">No approved requisitions found</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default StaffApproval;
