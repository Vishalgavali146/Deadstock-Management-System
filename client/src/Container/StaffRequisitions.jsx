import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Heading, Spinner, Text, Button, useToast,
  Table, Thead, Tbody, Tr, Th, Td,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import SidebarMenu from "../PopUps/Sidebar";
import "./Container.css";

const StaffRequisitions = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const fetchRequisitions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/RequisitionsRequest`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
        description: "The requisition has been forwarded to Lab Incharge.",
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

  const thStyle = {
    fontSize: "10px", textTransform: "uppercase",
    letterSpacing: "wider", color: "gray.500", fontWeight: "600", py: 3,
  };

  return (
    <div className="second-home-container">
      <div className="sidebar-container">
        <SidebarMenu />
      </div>

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Top Bar */}
        <div
          style={{
            display: "flex", alignItems: "center", padding: "0 28px",
            height: 60, background: "#ffffff",
            borderBottom: "1px solid var(--surface-border)",
            position: "sticky", top: 0, zIndex: 20,
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>
            Requisitions
          </span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto" }}>
          <Box p={6}>
            <Box mb={5}>
              <Heading size="md" color="gray.800" mb={1}>Pending Requisitions</Heading>
              <Text fontSize="sm" color="gray.500">
                {requisitions.length} pending requisition{requisitions.length !== 1 ? "s" : ""} awaiting your approval
              </Text>
            </Box>

            {loading ? (
              <Box display="flex" alignItems="center" justifyContent="center" minH="300px">
                <Spinner size="lg" color="purple.500" thickness="3px" />
              </Box>
            ) : error ? (
              <Box textAlign="center" mt={10} p={6}>
                <Text color="red.500" fontWeight="500">{error}</Text>
              </Box>
            ) : (
              <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="sm" overflow="hidden">
                <Table size="sm" variant="unstyled">
                  <Thead bg="gray.50" borderBottom="1px solid" borderColor="gray.100">
                    <Tr>
                      <Th {...thStyle}>Req. Number</Th>
                      <Th {...thStyle}>Date</Th>
                      <Th {...thStyle}>Department</Th>
                      <Th {...thStyle}>Lab No</Th>
                      <Th {...thStyle}>Category</Th>
                      <Th {...thStyle}>Requester</Th>
                      <Th {...thStyle}>Email</Th>
                      <Th {...thStyle} textAlign="center">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {requisitions.length > 0 ? (
                      requisitions.map((req) => (
                        <Tr
                          key={req._id}
                          borderBottom="1px solid" borderColor="gray.50"
                          _hover={{ bg: "gray.50" }} transition="background 0.15s"
                        >
                          <Td px={4} py={3} fontWeight="500" fontSize="sm" color="gray.800">
                            {req.generalDetails.requisitionNumber}
                          </Td>
                          <Td px={4} py={3} fontSize="sm" color="gray.600">
                            {new Date(req.generalDetails.date).toLocaleDateString()}
                          </Td>
                          <Td px={4} py={3} fontSize="sm" color="gray.600">
                            {req.generalDetails.from}
                          </Td>
                          <Td px={4} py={3} fontSize="sm" color="gray.600">
                            {req.generalDetails.roomNo}
                          </Td>
                          <Td px={4} py={3} fontSize="sm" color="gray.600">
                            {req.generalDetails.category}
                          </Td>
                          <Td px={4} py={3} fontSize="sm" color="gray.700" fontWeight="500">
                            {req.generalDetails.requesterName}
                          </Td>
                          <Td px={4} py={3} fontSize="sm" color="gray.500">
                            {req.generalDetails.requesterEmail}
                          </Td>
                          <Td px={4} py={3}>
                            <Box display="flex" gap={2} justifyContent="center">
                              <Button
                                leftIcon={<ViewIcon />}
                                colorScheme="purple" size="xs"
                                variant="ghost" borderRadius="lg"
                                onClick={() => handleView(req)}
                                _hover={{ bg: "purple.50" }}
                              >
                                View
                              </Button>
                              <Button
                                colorScheme="green" size="xs" borderRadius="lg"
                                onClick={() => handleApprove(req._id)}
                              >
                                Approve
                              </Button>
                            </Box>
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={8} textAlign="center" py={16}>
                          <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
                            <Box w="48px" h="48px" bg="gray.100" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                              <Text fontSize="xl">📋</Text>
                            </Box>
                            <Text fontSize="sm" fontWeight="500" color="gray.500">No pending requisitions</Text>
                            <Text fontSize="xs" color="gray.400">Requisitions from your lab will appear here</Text>
                          </Box>
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </Box>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default StaffRequisitions;
