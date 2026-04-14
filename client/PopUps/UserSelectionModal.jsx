import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

function UserSelectionModal({ isOpen, onClose, onSelectUser }) {
  const [users, setUsers] = useState([]);
  // We'll allow only single selection here.
  const [selectedUserId, setSelectedUserId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchApprovedUsers();
    }
  }, [isOpen]);

  const fetchApprovedUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/AppUsers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersArray = response.data.Approvals || [];
      const usersWithStatus = usersArray.map((user) => ({
        ...user,
        status: user.status || "active",
      }));
      setUsers(usersWithStatus);
    } catch (error) {
      console.error("Error fetching approved users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCheckboxChange = (userId) => {
    if (selectedUserId === userId) {
      setSelectedUserId(null);
    } else {
      setSelectedUserId(userId);
    }
  };

  const handleSelect = () => {
    const selectedUser = users.find((user) => user._id === selectedUserId);
    if (selectedUser) {
      onSelectUser(selectedUser);
      onClose();
    } else {
      toast({
        title: "No user selected",
        description: "Please select a user.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Requester</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Select</Th>
                  <Th>Username</Th>
                  <Th>Email</Th>
                  <Th>Role</Th>
                  <Th>Lab ID</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user) => (
                  <Tr key={user._id}>
                    <Td>
                      <Checkbox
                        isChecked={selectedUserId === user._id}
                        onChange={() => handleCheckboxChange(user._id)}
                      />
                    </Td>
                    <Td>{user.username}</Td>
                    <Td>{user.email}</Td>
                    <Td>{user.role}</Td>
                    <Td>
                      {user.LabId &&
                      user.LabId.trim() !== "" &&
                      user.LabId.toLowerCase() !== "null"
                        ? user.LabId
                        : "Not Assigned"}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSelect}>
            Select
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default UserSelectionModal;
