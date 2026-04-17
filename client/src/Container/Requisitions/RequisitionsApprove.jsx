// RequisitionsApprove.js
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
import { useNavigate } from "react-router-dom"; // Import useNavigate

function RequisitionsApprove() {
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
          "http://localhost:5000/api/requisitions",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
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
              <Th px="4" py="3" fontWeight="semibold" color="gray.600">
                Requisition Number
              </Th>
              <Th px="4" py="3" fontWeight="semibold" color="gray.600">
                Date
              </Th>
              <Th px="4" py="3" fontWeight="semibold" color="gray.600">
                From (Department)
              </Th>
              <Th px="4" py="3" fontWeight="semibold" color="gray.600">
                To (Purchase Officer)
              </Th>
              <Th px="4" py="3" fontWeight="semibold" color="gray.600">
                Reference
              </Th>
              <Th px="4" py="3" fontWeight="semibold" color="gray.600">
                Requester Name
              </Th>
              <Th px="4" py="3" fontWeight="semibold" color="gray.600">
                Requester Email
              </Th>
              <Th px="4" py="3" fontWeight="semibold" color="gray.600">
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

export default RequisitionsApprove;
