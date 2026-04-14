import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  VStack,
  HStack,
  Heading,
  Divider,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useRequisition } from "../../Provider/RequisitionContext";
import UserSelectionModal from "../../PopUps/UserSelectionModal";

function GeneralDetails() {
  const { requisitionData, updateGeneralDetails } = useRequisition();
  const generalDetails = requisitionData.generalDetails;
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : {};

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (token && decodedToken) {
      updateGeneralDetails((prev) => ({
        ...prev,
        requesterEmail: decodedToken.email,
        requesterName: prev.requesterName || decodedToken.username || "",
        roomNo: decodedToken.labId,
        from: decodedToken.departmentId,
      }));
    }
  }, [token]);

  const handleChange = (field, value) => {
    updateGeneralDetails({ [field]: value });
  };

  const initialGeneralDetails = {
    requisitionNumber: "",
    date: "2025-03-04",
    to: "Procurement Department",
    from: "IT Department",
    reference: "Internal Request",
    requesterName: "",
    requesterEmail: "",
    requesterPhone: "",
    requesterRole: "",
    roomNo: "",
    approverName: "",
    approverEmail: "",
    approverRole: "Subject Teacher",
    category: "Equipment",
  };

  const handleCancel = () => {
    updateGeneralDetails(initialGeneralDetails);
  };

  const handleApproverSelect = (user) => {
    updateGeneralDetails({
      approverName: user.username,
      approverEmail: user.email,
    });
    setIsModalOpen(false);
  };

  return (
    <Box
      p={6}
      maxW="1240px"
      w="100%"
      mx="auto"
      boxShadow="lg"
      borderRadius="lg"
      bg="white"
    >
      <Heading size="lg" mb={2} color="gray.700">
        Requisition Details
      </Heading>
      <Text fontSize="sm" color="gray.500" mb={6}>
        Provide general information about this purchase request
      </Text>

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
        {/* Left Side */}
        <GridItem>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4} align="start">
              <FormControl flex={1}>
                <FormLabel fontWeight="bold">Requisition Number</FormLabel>
                <Input
                  value={generalDetails.requisitionNumber || ""}
                  onChange={(e) =>
                    handleChange("requisitionNumber", e.target.value)
                  }
                  bg="gray.50"
                  w="full"
                />
              </FormControl>
              <FormControl flex={1}>
                <FormLabel fontWeight="bold">Date</FormLabel>
                <Input
                  type="date"
                  bg="gray.50"
                  value={generalDetails.date || ""}
                  w="full"
                  onChange={(e) => handleChange("date", e.target.value)}
                />
              </FormControl>
            </HStack>
            <HStack>
              <FormControl>
                <FormLabel fontWeight="bold">To (Purchase Officer)</FormLabel>
                <Select
                  bg="gray.50"
                  w="full"
                  value={generalDetails.to || ""}
                  onChange={(e) => handleChange("to", e.target.value)}
                >
                  <option>Procurement Department</option>
                  <option>ENTC Department</option>
                  <option>Procurement Manager</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="bold">Reference</FormLabel>
                <Input
                  placeholder="Enter reference (e.g., Internal Memo)"
                  bg="gray.50"
                  w="full"
                  value={generalDetails.reference || ""}
                  onChange={(e) => handleChange("reference", e.target.value)}
                />
              </FormControl>
            </HStack>
            <FormControl>
              <FormLabel fontWeight="bold">From (Department)</FormLabel>
              <Input
                bg="gray.50"
                w="full"
                value={generalDetails.from || ""}
                onChange={(e) => handleChange("from", e.target.value)}
                isReadOnly
              />
            </FormControl>

            <HStack>
              <FormControl>
                <FormLabel fontWeight="bold">Category</FormLabel>
                <Select
                  bg="gray.50"
                  w="full"
                  value={generalDetails.category || ""}
                  onChange={(e) => handleChange("category", e.target.value)}
                >
                  <option value="Equipments">Equipments</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Consumables">Consumables</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="bold">Room No</FormLabel>
                <Input
                  placeholder="Enter Room No"
                  bg="gray.50"
                  w="full"
                  value={generalDetails.roomNo || ""}
                  onChange={(e) => handleChange("roomNo", e.target.value)}
                  isReadOnly
                />
              </FormControl>
            </HStack>

            <Button colorScheme="teal" onClick={() => setIsModalOpen(true)}>
              Select Approver
            </Button>
          </VStack>
        </GridItem>

        {/* Right Side */}
        <GridItem>
          <VStack
            spacing={4}
            align="stretch"
            bg="gray.50"
            borderRadius="md"
            p={4}
            transform="translateY(0.5rem)"
            minH="385px"
          >
            <Heading size="md" mt={4} mb={2} color="gray.700">
              Requester Information
            </Heading>
            <HStack>
              <FormControl>
                <FormLabel fontWeight="bold">Full Name (Requester)</FormLabel>
                <Input
                  placeholder="Enter your full name"
                  bg="gray.50"
                  w="full"
                  value={generalDetails.requesterName || ""}
                  onChange={(e) =>
                    handleChange("requesterName", e.target.value)
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="bold">Full Name (Approver)</FormLabel>
                <Input
                  placeholder="Enter approver's full name"
                  bg="gray.50"
                  w="full"
                  value={generalDetails.approverName || ""}
                  onChange={(e) => handleChange("approverName", e.target.value)}
                />
              </FormControl>
            </HStack>

            <HStack>
              <FormControl>
                <FormLabel fontWeight="bold">
                  Email Address (Requester)
                </FormLabel>
                <Input
                  type="email"
                  bg="gray.50"
                  w="full"
                  value={generalDetails.requesterEmail || ""}
                  onChange={(e) =>
                    handleChange("requesterEmail", e.target.value)
                  }
                  isReadOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="bold">
                  Email Address (Approver)
                </FormLabel>
                <Input
                  type="email"
                  placeholder="Enter approver's email"
                  bg="gray.50"
                  w="full"
                  value={generalDetails.approverEmail || ""}
                  onChange={(e) =>
                    handleChange("approverEmail", e.target.value)
                  }
                />
              </FormControl>
            </HStack>

            <HStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel fontWeight="bold">
                  Phone Number (Requester)
                </FormLabel>
                <Input
                  placeholder="(123) 456-7890"
                  bg="gray.50"
                  w="full"
                  value={generalDetails.requesterPhone || ""}
                  onChange={(e) =>
                    handleChange("requesterPhone", e.target.value)
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="bold">Approver Role</FormLabel>
                <Select
                  bg="gray.50"
                  w="full"
                  value={generalDetails.approverRole || ""}
                  onChange={(e) => handleChange("approverRole", e.target.value)}
                >
                  <option value="Subject Teacher">Subject Teacher</option>
                  <option value="Lab Incharge">Lab Incharge</option>
                </Select>
              </FormControl>
            </HStack>
            <Divider />
          </VStack>
        </GridItem>
      </Grid>

      <Divider my={6} />
      <HStack spacing={4} mt={4} justifyContent="flex-end">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button colorScheme="blue">Next</Button>
      </HStack>
      <UserSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectUser={handleApproverSelect}
      />
    </Box>
  );
}

export default GeneralDetails;
