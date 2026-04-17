import React, { useEffect, useState } from "react";
import SidebarMenu from "../../PopUps/Sidebar";
import axios from "axios";
import {
  Box,
  Button,
  Input,
  Select,
  Text,
  VStack,
  HStack,
  Card,
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
    setVerify((prev) => ({
      ...prev,
      email: user.email,
    }));
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

  return (
    <Flex>
      <SidebarMenu />

      <VStack spacing={6} w="full">

        <Box
          w="full"
          h="220px"
          p={4}
          bg="white"
          borderRadius="lg"
          boxShadow="4px 4px 10px rgba(0, 0, 0, 0.1)"
        >
          <VStack align="start" spacing={0.1} mb={4}>
            <Heading size="lg">User Management Dashboard</Heading>
            <Text color="gray.600">
              Manage user verification and role assignment
            </Text>
          </VStack>

          <HStack w="full" justify="space-between">
            <Card p={4} w="32%" bg="gray.100" h="100%">
              <HStack justify="space-between" w="full">
                <VStack align="start" spacing={0}>
                  <Text fontSize="md">Total Users</Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    {totalUsers}
                  </Text>
                </VStack>
                <FaUsers size={28} />
              </HStack>
            </Card>

            <Card p={4} w="32%" bg="green.100" h="100%">
              <HStack justify="space-between" w="full">
                <VStack align="start" spacing={0}>
                  <Text fontSize="md">Verified</Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    {verifiedUsers}
                  </Text>
                </VStack>
                <FaUserCheck size={28} />
              </HStack>
            </Card>

            <Card p={4} w="32%" bg="yellow.100" h="100%">
              <HStack justify="space-between" w="full">
                <VStack align="start" spacing={0}>
                  <Text fontSize="md">Pending</Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    {pendingUsers}
                  </Text>
                </VStack>
                <FaClock size={28} />
              </HStack>
            </Card>
          </HStack>
        </Box>

        <HStack w="full" align="start">
 
          <Box
            w="52%"
            p={4}
            borderWidth={1}
            borderRadius="md"
            bg="white"
            h="404px"
          >
            <HStack spacing={2}>
              <FaUserFriends size={24} color="blue" />
              <Text fontSize="lg" fontWeight="bold">
                Unverified Users
              </Text>
            </HStack>

            <Input
              placeholder="Search by username or email..."
              my={2}
              value={searchTerm}
              onChange={handleSearch}
            />

            <Box maxH="300px" overflowY="auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <HStack
                    key={user.username}
                    p={2}
                    borderBottomWidth={1}
                    justify="space-between"
                  >
                    <VStack align="start">
                      <Text fontWeight="bold">{user.username}</Text>
                      <Text fontSize="sm">{user.email}</Text>
                      <Text fontSize="xs" color="gray.500">
                        Registered: {user.registered}
                      </Text>
                    </VStack>
                    <Button
                      colorScheme="green"
                      onClick={() => handleVerify(user)}
                    >
                      Verify
                    </Button>
                  </HStack>
                ))
              ) : (
                <Text>No matching users found.</Text>
              )}
            </Box>
          </Box>

          <Box
            w="48%"
            p={4}
            borderWidth={1}
            borderRadius="md"
            h="404px"
            bg="white"
          >
            <HStack spacing={2}>
              <FaUsersCog size={24} color="blue" />
              <Text fontSize="lg" fontWeight="bold">
                Assign Role
              </Text>
            </HStack>

            <Input
              placeholder="Email"
              name="email"
              my={5}
              value={verify.email}
              onChange={handleInput}
            />

            <Select
              name="role"
              my={5}
              value={verify.role}
              onChange={handleInput}
            >
              <option value="">Select Role</option>
              <option value="Lab_Assistance">Lab_Assistance</option>
              <option value="Lab_Incharge">Lab_Incharge</option>
            </Select>

            <Input
              placeholder="Room Number"
              my={7}
              name="LabId"
              value={verify.LabId}
              onChange={handleInput}
            />

            <Button
              colorScheme="blue"
              isDisabled={!verify.email}
              w="full"
              onClick={handleSubmit}
            >
              <HStack spacing={2} justify="center">
                <FaUsersCog size={24} color="white" />
                <Text>Assign Role</Text>
              </HStack>
            </Button>
          </Box>
        </HStack>
      </VStack>
    </Flex>
  );
}
