import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Flex,
  Select,
  HStack,
  IconButton,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FaUsers, FaUserCheck, FaClock } from "react-icons/fa";
import axios from "axios";

function ApprovedUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchVerifiedUsers();
  }, []);

  const fetchVerifiedUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/AppUsers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response.data);

      // backend sends approvals array
      const usersArray =
        response.data.approvals || response.data.Approvals || [];

      // Ensure status is always present (default "Approved" because these are approved users)
      const usersWithStatus = usersArray.map((user) => ({
        ...user,
        status: user.status || "Approved",
      }));

      setUsers(usersWithStatus);
    } catch (error) {
      console.error("Error fetching verified users:", error);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedUsers(users.map((user) => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleToggleStatus = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId
          ? {
              ...user,
              status: user.status === "Approved" ? "Pending" : "Approved",
            }
          : user
      )
    );
  };

  const filteredUsers = users.filter((user) => {
    let statusMatch = true;
    let roleMatch = true;

    if (statusFilter !== "all") {
      statusMatch = user.status === statusFilter;
    }

    if (roleFilter !== "all") {
      // role is string, compare directly
      roleMatch = user.role === roleFilter;
    }

    return statusMatch && roleMatch;
  });

  const totalUsersCount = users.length;
  const labAssignedCount = users.filter(
    (user) =>
      user.LabId &&
      user.LabId.trim() !== "" &&
      user.LabId.toLowerCase() !== "null"
  ).length;
  const pendingCount = totalUsersCount - labAssignedCount;

  return (
    <Box minH="100vh">
      {/* Top Stats Cards */}
      <Box
        w="full"
        h="220px"
        p={3}
        bg="white"
        borderRadius="lg"
        boxShadow="4px 4px 10px rgba(0, 0, 0, 0.1)"
      >
        <VStack align="start" spacing={1} mb={4}>
          <Heading size="lg">User Management Dashboard</Heading>
          <Text color="gray.600">
            Manage user verification and lab assignment
          </Text>
        </VStack>

        <HStack w="full" justify="space-between">
          <Box p={3} w="32%" bg="gray.100" borderRadius="lg">
            <HStack justify="space-between">
              <VStack align="start">
                <Text fontSize="md">Total Users</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {totalUsersCount}
                </Text>
              </VStack>
              <FaUsers size={28} />
            </HStack>
          </Box>

          <Box p={3} w="32%" bg="green.100" borderRadius="lg">
            <HStack justify="space-between">
              <VStack align="start">
                <Text fontSize="md">Lab Assigned</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {labAssignedCount}
                </Text>
              </VStack>
              <FaUserCheck size={28} />
            </HStack>
          </Box>

          <Box p={3} w="32%" bg="yellow.100" borderRadius="lg">
            <HStack justify="space-between">
              <VStack align="start">
                <Text fontSize="md">Pending Lab</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {pendingCount}
                </Text>
              </VStack>
              <FaClock size={28} />
            </HStack>
          </Box>
        </HStack>
      </Box>

      {/* Table Container */}
      <Box bg="white" boxShadow="sm" borderRadius="md" p={4} mt={6}>
        {/* Table Header & Filters */}
        <Flex mb={4} justifyContent="space-between" alignItems="center">
          <Heading size="md" color="gray.700">
            Verified Users
          </Heading>
          <HStack spacing={4}>
            <Select
              size="sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
            </Select>
            <Select
              size="sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="Lab_Incharge">Lab_Incharge</option>
              <option value="Lab_Assistant">Lab_Assistant</option>
              <option value="Department_DSR_Incharge">
                Department_DSR_Incharge
              </option>
              <option value="Central_DSR_Incharge">Central_DSR_Incharge</option>
              <option value="HOD">HOD</option>
            </Select>
          </HStack>
        </Flex>

        {/* Users Table */}
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>
                <Checkbox
                  isChecked={
                    selectedUsers.length === users.length && users.length > 0
                  }
                  isIndeterminate={
                    selectedUsers.length > 0 &&
                    selectedUsers.length < users.length
                  }
                  onChange={handleSelectAll}
                />
              </Th>
              <Th>Username</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Room Number</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredUsers.map((user) => (
              <Tr key={user._id}>
                <Td>
                  <Checkbox
                    isChecked={selectedUsers.includes(user._id)}
                    onChange={() => handleSelectUser(user._id)}
                  />
                </Td>
                <Td>{user.username}</Td>
                <Td>{user.email || "N/A"}</Td>
                <Td>{user.role || "N/A"}</Td>
                <Td>
                  {user.LabId &&
                  user.LabId.trim() !== "" &&
                  user.LabId.toLowerCase() !== "null"
                    ? user.LabId
                    : "Not Assigned"}
                </Td>
                <Td>
                  <Text
                    cursor="pointer"
                    onClick={() => handleToggleStatus(user._id)}
                    color={
                      user.status === "Approved" ? "green.500" : "orange.500"
                    }
                  >
                    {user.status}
                  </Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Pagination */}
        <Flex mt={4} justifyContent="space-between" alignItems="center">
          <Text fontSize="sm" color="gray.600">
            Showing 1 to {filteredUsers.length} of {filteredUsers.length} users
          </Text>
          <HStack>
            <IconButton
              size="sm"
              icon={<ChevronLeftIcon />}
              aria-label="Previous page"
            />
            <Text>1</Text>
            <IconButton
              size="sm"
              icon={<ChevronRightIcon />}
              aria-label="Next page"
            />
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
}

export default ApprovedUsers;
