import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Text,
  VStack,
  HStack,
  Heading,
  Grid,
  GridItem,
  Divider,
  Spinner,
  Select,
} from "@chakra-ui/react";
import { useRequisition } from "../../Provider/RequisitionContext";
import axios from "axios";
import { printApproval } from "./PrintApproval";

function Approval() {
  const [budget, setBudget] = useState({
    equipment: 0,
    furniture: 0,
    consumables: 0,
    SanctionAmount: 0,
  });

  const { requisitionData, updateApproval, handleSubmit, loading } =
    useRequisition();
  const approval = requisitionData.approval;
  const generalCategory = requisitionData.generalDetails?.category || "";

  const handleChange = (field, value) => {
    const numericFields = [
      "SanctionBudget",
      "BalanceAmount",
      "ApproximateAmount",
      "AmountSpent",
    ];
    const newValue = numericFields.includes(field) ? Number(value) : value;
    updateApproval({ [field]: newValue });
  };

  const handleAttachment = (file) => {
    updateApproval({ attachment: file });
  };

  const getRowTotal = (item) => {
    if (typeof item.totalPrice !== "undefined")
      return Number(item.totalPrice) || 0;
    const qty = Number(item.qty) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    return qty * unitPrice;
  };

  const totalCost = requisitionData.items.reduce(
    (acc, item) => acc + getRowTotal(item),
    0
  );

  useEffect(() => {
    const balance = totalCost;
    const approx = approval.AmountSpent - balance;
    updateApproval({
      BalanceAmount: balance,
      ApproximateAmount: !isNaN(approx) ? Math.round(approx) : "",
    });
  }, [totalCost, approval.AmountSpent]);

  const initialApproval = {
    SanctionBudget: 0,
    AmountSpent: 0,
    BalanceAmount: 0,
    ApproximateAmount: 0,
    additionalNotes: "",
    attachment: null,
  };

  const fetchBudget = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:5000/getBudget", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedBudget = response.data.msg || {};
      updateApproval({ SanctionBudget: fetchedBudget.SanctionAmount || 0 });

      setBudget({
        equipment: fetchedBudget.equipment ?? 0,
        furniture: fetchedBudget.furniture ?? 0,
        consumables: fetchedBudget.consumables ?? 0,
        SanctionAmount: fetchedBudget.SanctionAmount ?? 0,
      });

      if (generalCategory) {
        handleChange("AmountSpent", fetchedBudget[generalCategory] || 0);
      }
    } catch (err) {
      console.log("Error Occurred", err);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  useEffect(() => {
    if (requisitionData.generalDetails.category) {
      const selected = requisitionData.generalDetails.category.toLowerCase();
      updateApproval({ AmountSpent: budget[selected] || 0 });
    }
  }, [requisitionData.generalDetails.category, budget]);

  const handleCancel = () => {
    updateApproval(initialApproval);
  };

  return (
    <Box
      maxW="1500px"
      w={1240}
      mx="auto"
      p={6}
      pb={4}
      bg="white"
      boxShadow="md"
      borderRadius="md"
    >
      <Heading size="lg" mb={2} color="gray.700">
        Budget & Approval Details
      </Heading>
      <Text fontSize="sm" color="gray.500" mb={2}>
        Specify budget allocation and approval details
      </Text>

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
        <GridItem>
          <Box p={4} borderRadius="md">
            <Heading size="md" mb={4} color="gray.700">
              Budget Details
            </Heading>
            <VStack spacing={4} align="stretch">
              <HStack>
                <FormControl>
                  <FormLabel fontWeight="bold">Sanction Budget</FormLabel>
                  <Input value={approval.SanctionBudget || ""} isReadOnly />
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="bold">Amount Spent</FormLabel>
                  <Input value={approval.AmountSpent || ""} />
                </FormControl>
              </HStack>
              <FormControl>
                <FormLabel fontWeight="bold">Balance Amount</FormLabel>
                <Input value={approval.BalanceAmount || ""} />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="bold">Approximate Amount</FormLabel>
                <Input value={approval.ApproximateAmount || ""} />
              </FormControl>
              <Text fontSize="sm" color="gray.600">
                The requested amount is within your available budget.
              </Text>
            </VStack>
          </Box>
        </GridItem>

        <GridItem>
          <Box bg="gray.50" p={4} borderRadius="md">
            <Heading size="md" mb={4} color="gray.700">
              Approval Details
            </Heading>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel fontWeight="bold">Additional Notes</FormLabel>
                <Textarea
                  placeholder="Enter any additional information"
                  rows={6}
                  value={approval.additionalNotes || ""}
                  onChange={(e) =>
                    handleChange("additionalNotes", e.target.value)
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="bold">Attachment</FormLabel>
                <Input
                  id="attachment"
                  type="file"
                  display="none"
                  onChange={(e) => handleAttachment(e.target.files[0])}
                />
                <label htmlFor="attachment">
                  <Button as="span" variant="outline" colorScheme="blue">
                    Choose File
                  </Button>
                </label>
                {approval.attachment && (
                  <Text mt={2} fontSize="sm">
                    Selected File: {approval.attachment.name}
                  </Text>
                )}
              </FormControl>
            </VStack>
          </Box>
        </GridItem>
      </Grid>

      <Divider my={6} />
      <HStack spacing={4} justifyContent="flex-end">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          variant="outline"
          onClick={() => printApproval(requisitionData, totalCost, getRowTotal)}
        >
          Print
        </Button>
        <Button colorScheme="blue" onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner size="sm" /> : "Submit"}
        </Button>
      </HStack>
    </Box>
  );
}

export default Approval;
