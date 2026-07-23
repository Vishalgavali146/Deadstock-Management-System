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
  Heading,
  VStack,
} from "@chakra-ui/react";
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
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/AppUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      const usersArray =
        response.data.approvals || response.data.Approvals || [];
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
          ? { ...user, status: user.status === "Approved" ? "Pending" : "Approved" }
          : user
      )
    );
  };

  const filteredUsers = users.filter((user) => {
    let statusMatch = true;
    let roleMatch = true;
    if (statusFilter !== "all") statusMatch = user.status === statusFilter;
    if (roleFilter !== "all") roleMatch = user.role === roleFilter;
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

  const statCard = (bg, icon, label, count) => (
    <Box
      flex="1"
      p={4}
      bg={bg}
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.100"
    >
      <HStack justify="space-between">
        <VStack align="start" spacing={0.5}>
          <Text fontSize="xs" fontWeight="600" color="gray.500" textTransform="uppercase" letterSpacing="wider">
            {label}
          </Text>
          <Text fontSize="2xl" fontWeight="700" color="gray.800">
            {count}
          </Text>
        </VStack>
        <Box p={2} bg="white" borderRadius="lg" boxShadow="sm">
          {icon}
        </Box>
      </HStack>
    </Box>
  );

  return (
    <Box p={6} minH="100vh" bg="gray.50">
      {/* Stats Cards */}
      <Box mb={6}>
        <Heading size="md" mb={1} color="gray.800">User Management</Heading>
        <Text fontSize="sm" color="gray.500" mb={4}>Manage user verification and lab assignment</Text>
        <HStack spacing={4}>
          {statCard("white", <FaUsers size={20} color="#6366f1" />, "Total Users", totalUsersCount)}
          {statCard("#f0fdf4", <FaUserCheck size={20} color="#10b981" />, "Lab Assigned", labAssignedCount)}
          {statCard("#fffbeb", <FaClock size={20} color="#f59e0b" />, "Pending Lab", pendingCount)}
        </HStack>
      </Box>

      {/* Table Card */}
      <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="sm" overflow="hidden">
        {/* Table Header */}
        <Flex px={5} py={4} justifyContent="space-between" alignItems="center" borderBottom="1px solid" borderColor="gray.100">
          <Text fontWeight="600" fontSize="sm" color="gray.700">Verified Users</Text>
          <HStack spacing={3}>
            <Select
              size="sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              borderRadius="lg"
              fontSize="13px"
              border="1px solid"
              borderColor="gray.200"
            >
              <option value="all">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
            </Select>
            <Select
              size="sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              borderRadius="lg"
              fontSize="13px"
              border="1px solid"
              borderColor="gray.200"
            >
              <option value="all">All Roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="Lab_Incharge">Lab Incharge</option>
              <option value="Lab_Assistant">Lab Assistant</option>
              <option value="Department_DSR_Incharge">Dept DSR IC</option>
              <option value="Central_DSR_Incharge">Central DSR IC</option>
              <option value="HOD">HOD</option>
            </Select>
          </HStack>
        </Flex>

        {/* Users Table */}
        <Table size="sm">
          <Thead>
            <Tr bg="gray.50">
              <Th fontSize="10px" letterSpacing="wider" py={3}>
                <Checkbox
                  isChecked={selectedUsers.length === users.length && users.length > 0}
                  isIndeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                  onChange={handleSelectAll}
                  colorScheme="purple"
                />
              </Th>
              <Th fontSize="10px" letterSpacing="wider" color="gray.500">Username</Th>
              <Th fontSize="10px" letterSpacing="wider" color="gray.500">Email</Th>
              <Th fontSize="10px" letterSpacing="wider" color="gray.500">Role</Th>
              <Th fontSize="10px" letterSpacing="wider" color="gray.500">Lab / Room</Th>
              <Th fontSize="10px" letterSpacing="wider" color="gray.500">Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredUsers.map((user) => (
              <Tr key={user._id} _hover={{ bg: "gray.50" }} transition="background 0.15s">
                <Td>
                  <Checkbox
                    isChecked={selectedUsers.includes(user._id)}
                    onChange={() => handleSelectUser(user._id)}
                    colorScheme="purple"
                  />
                </Td>
                <Td fontWeight="500" fontSize="sm" color="gray.800">{user.username}</Td>
                <Td fontSize="sm" color="gray.600">{user.email || "N/A"}</Td>
                <Td>
                  <Box
                    as="span"
                    px={2}
                    py={0.5}
                    fontSize="11px"
                    fontWeight="600"
                    bg="purple.50"
                    color="purple.700"
                    borderRadius="full"
                    border="1px solid"
                    borderColor="purple.100"
                  >
                    {user.role || "N/A"}
                  </Box>
                </Td>
                <Td fontSize="sm" color="gray.600">
                  {user.LabId && user.LabId.trim() !== "" && user.LabId.toLowerCase() !== "null"
                    ? user.LabId
                    : (
                      <Text fontSize="12px" color="gray.400" fontStyle="italic">Not Assigned</Text>
                    )}
                </Td>
                <Td>
                  <Box
                    as="span"
                    display="inline-flex"
                    alignItems="center"
                    px={2}
                    py={0.5}
                    fontSize="11px"
                    fontWeight="600"
                    bg={user.status === "Approved" ? "green.50" : "yellow.50"}
                    color={user.status === "Approved" ? "green.700" : "yellow.700"}
                    borderRadius="full"
                    border="1px solid"
                    borderColor={user.status === "Approved" ? "green.100" : "yellow.100"}
                    cursor="pointer"
                    onClick={() => handleToggleStatus(user._id)}
                    transition="all 0.15s"
                    _hover={{ opacity: 0.8 }}
                  >
                    {user.status}
                  </Box>
                </Td>
              </Tr>
            ))}
            {filteredUsers.length === 0 && (
              <Tr>
                <Td colSpan={6} textAlign="center" py={12} color="gray.400" fontSize="sm">
                  No users found matching the selected filters.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>

        {/* Footer */}
        <Flex px={5} py={3} justifyContent="space-between" alignItems="center" borderTop="1px solid" borderColor="gray.100">
          <Text fontSize="12px" color="gray.500">
            Showing {filteredUsers.length} of {users.length} users
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}

export default ApprovedUsers;
