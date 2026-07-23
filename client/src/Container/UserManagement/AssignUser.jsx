import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Input,
  Select,
  Text,
  VStack,
  HStack,
  Heading,
  Flex,
} from "@chakra-ui/react";
import {
  FaUserCheck,
  FaClock,
  FaUsers,
  FaUsersCog,
  FaUserFriends,
} from "react-icons/fa";

export default function AssignUser() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [verifiedUsers, setVerifiedUsers] = useState(0);
  const [pendingUsers, setPendingUsers] = useState(0);
  const [verify, setVerify] = useState({
    email: "",
    role: "",
    LabId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }
    try {
      const response = await axios.get("http://localhost:5000/Requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && Array.isArray(response.data.pendingRequests)) {
        setUsers(response.data.pendingRequests);
        setTotalUsers(response.data.totalUsers || 0);
        setVerifiedUsers(response.data.verifiedUsers || 0);
        setPendingUsers(response.data.pendingUsers || 0);
      } else {
        console.error("Unexpected response format:", response.data);
        setUsers([]);
        setTotalUsers(0);
        setVerifiedUsers(0);
        setPendingUsers(0);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setUsers([]);
      setTotalUsers(0);
      setVerifiedUsers(0);
      setPendingUsers(0);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleVerify = (user) => {
    setVerify((prev) => ({ ...prev, email: user.email }));
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    setVerify((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    console.log(verify);
    if (!verify.email || !verify.role || !verify.LabId) {
      alert("Please fill all fields before submitting.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/ApproveRequest",
        verify,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        alert("User verified successfully!");
        fetchData();
      } else {
        alert("Error verifying user.");
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "An unexpected error occurred.";
      alert(`Error: ${errorMessage}`);
    }
  };

  const statCard = (bg, icon, label, count) => (
    <Box flex="1" p={4} bg={bg} borderRadius="xl" border="1px solid" borderColor="gray.100">
      <HStack justify="space-between">
        <VStack align="start" spacing={0.5}>
          <Text fontSize="xs" fontWeight="600" color="gray.500" textTransform="uppercase" letterSpacing="wider">{label}</Text>
          <Text fontSize="2xl" fontWeight="700" color="gray.800">{count}</Text>
        </VStack>
        <Box p={2} bg="white" borderRadius="lg" boxShadow="sm">{icon}</Box>
      </HStack>
    </Box>
  );

  return (
    <Box p={6} minH="100vh" bg="gray.50">
      {/* Stats */}
      <Box mb={6}>
        <Heading size="md" mb={1} color="gray.800">Assign User Roles</Heading>
        <Text fontSize="sm" color="gray.500" mb={4}>Verify and assign roles to pending users</Text>
        <HStack spacing={4}>
          {statCard("white", <FaUsers size={20} color="#6366f1" />, "Total Users", totalUsers)}
          {statCard("#f0fdf4", <FaUserCheck size={20} color="#10b981" />, "Verified", verifiedUsers)}
          {statCard("#fffbeb", <FaClock size={20} color="#f59e0b" />, "Pending", pendingUsers)}
        </HStack>
      </Box>

      {/* Two-panel layout */}
      <HStack spacing={5} align="start">
        {/* Left: Unverified Users */}
        <Box
          flex="1"
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.200"
          boxShadow="sm"
          overflow="hidden"
        >
          <Flex px={4} py={3} alignItems="center" gap={2} borderBottom="1px solid" borderColor="gray.100">
            <FaUserFriends size={18} color="#6366f1" />
            <Text fontWeight="600" fontSize="sm" color="gray.700">Unverified Users</Text>
          </Flex>

          <Box px={4} py={3}>
            <Input
              placeholder="Search by username or email..."
              size="sm"
              value={searchTerm}
              onChange={handleSearch}
              borderRadius="lg"
              fontSize="13px"
              border="1px solid"
              borderColor="gray.200"
              _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 3px rgba(99,102,241,0.08)" }}
            />
          </Box>

          <Box maxH="340px" overflowY="auto" px={4} pb={4}>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <Box
                  key={user.username}
                  p={3}
                  mb={2}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.100"
                  _hover={{ bg: "gray.50", borderColor: "purple.100" }}
                  transition="all 0.15s"
                >
                  <Flex justify="space-between" alignItems="center">
                    <VStack align="start" spacing={0.5}>
                      <Text fontSize="13px" fontWeight="600" color="gray.800">{user.username}</Text>
                      <Text fontSize="12px" color="gray.500">{user.email}</Text>
                      {user.registered && (
                        <Text fontSize="11px" color="gray.400">
                          Registered: {user.registered}
                        </Text>
                      )}
                    </VStack>
                    <Button
                      size="xs"
                      colorScheme="purple"
                      variant="outline"
                      borderRadius="full"
                      fontSize="12px"
                      onClick={() => handleVerify(user)}
                    >
                      Select
                    </Button>
                  </Flex>
                </Box>
              ))
            ) : (
              <Box py={8} textAlign="center">
                <Text fontSize="sm" color="gray.400">No matching users found.</Text>
              </Box>
            )}
          </Box>
        </Box>

        {/* Right: Assign Role */}
        <Box
          flex="1"
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.200"
          boxShadow="sm"
          overflow="hidden"
        >
          <Flex px={4} py={3} alignItems="center" gap={2} borderBottom="1px solid" borderColor="gray.100">
            <FaUsersCog size={18} color="#6366f1" />
            <Text fontWeight="600" fontSize="sm" color="gray.700">Assign Role</Text>
          </Flex>

          <VStack px={5} py={5} spacing={4} align="stretch">
            <Box>
              <Text fontSize="12px" fontWeight="600" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={1.5}>Email</Text>
              <Input
                placeholder="User email"
                name="email"
                size="sm"
                value={verify.email}
                onChange={handleInput}
                borderRadius="lg"
                fontSize="13px"
                border="1px solid"
                borderColor="gray.200"
                _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 3px rgba(99,102,241,0.08)" }}
              />
            </Box>

            <Box>
              <Text fontSize="12px" fontWeight="600" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={1.5}>Role</Text>
              <Select
                name="role"
                size="sm"
                value={verify.role}
                onChange={handleInput}
                borderRadius="lg"
                fontSize="13px"
                border="1px solid"
                borderColor="gray.200"
                _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 3px rgba(99,102,241,0.08)" }}
              >
                <option value="">Select Role</option>
                <option value="Lab_Assistance">Lab Assistance</option>
                <option value="Lab_Incharge">Lab Incharge</option>
              </Select>
            </Box>

            <Box>
              <Text fontSize="12px" fontWeight="600" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={1.5}>Room Number</Text>
              <Input
                placeholder="e.g., LAB-101"
                name="LabId"
                size="sm"
                value={verify.LabId}
                onChange={handleInput}
                borderRadius="lg"
                fontSize="13px"
                border="1px solid"
                borderColor="gray.200"
                _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 3px rgba(99,102,241,0.08)" }}
              />
            </Box>

            <Button
              colorScheme="purple"
              isDisabled={!verify.email}
              w="full"
              size="sm"
              borderRadius="xl"
              h="40px"
              fontSize="13px"
              fontWeight="600"
              onClick={handleSubmit}
            >
              <HStack spacing={2} justify="center">
                <FaUsersCog size={15} />
                <Text>Assign Role & Verify</Text>
              </HStack>
            </Button>
          </VStack>
        </Box>
      </HStack>
    </Box>
  );
}
