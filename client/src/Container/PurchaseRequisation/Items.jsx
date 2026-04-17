import React from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Input,
  HStack,
  Heading,
  Divider,
  Select,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useRequisition } from "../../Provider/RequisitionContext";

function ItemsToBeProcured() {
  const { requisitionData, updateItems } = useRequisition();
  const items = requisitionData.items;
  const category = requisitionData.generalDetails.reference;
  const isConsumable = category === "Consumables" || category === "Consumable";

  const handleAddItem = () => {
    const newItem = isConsumable
      ? {
          id: items.length + 1,
          name: "",
          totalPrice: 0,
          requiredBy: "",
          priority: "Medium",
          remarks: "",
        }
      : {
          id: items.length + 1,
          name: "",
          qty: 1,
          unitPrice: 0,
          requiredBy: "",
          priority: "Medium",
          remarks: "",
        };
    updateItems([...items, newItem]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    updateItems(updatedItems);
  };

  const getRowTotal = (item) => {
    if (isConsumable) {
      return Number(item.totalPrice) || 0;
    }
    const qty = Number(item.qty) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    return qty * unitPrice;
  };

  const getTotalCost = () => {
    return items.reduce((acc, item) => acc + getRowTotal(item), 0);
  };

  const handleCancel = () => {
    updateItems([]);
  };

  return (
    <Box maxW="1200px" mx={5} p={6} bg="white" boxShadow="md" borderRadius="md">
      <Heading size="md" mb={2} color="gray.700">
        Items to be Procured
      </Heading>
      <Text fontSize="sm" color="gray.500" mb={6}>
        Add items that need to be purchased
      </Text>

      <Box
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        p={4}
        mb={4}
      >
        <HStack justifyContent="space-between" mb={4}>
          <Heading size="sm" color="gray.700">
            Items to be Procured
          </Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            variant="solid"
            onClick={handleAddItem}
          >
            Add Item
          </Button>
        </HStack>

        <Table variant="simple" style={{ tableLayout: "auto" }}>
          <Thead>
            <Tr>
              <Th width="5%">S.No</Th>
              <Th width="25%">Item Name</Th>
              {isConsumable ? (
                <Th width="20%">Total Price</Th>
              ) : (
                <>
                  <Th width="10%">Qty</Th>
                  <Th width="15%">Unit Price</Th>
                </>
              )}
              <Th width="15%">Total</Th>
              <Th width="15%">Required By</Th>
              <Th width="10%">Priority</Th>
              <Th width="10%">Remarks</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item, index) => (
              <Tr key={item.id}>
                <Td>{item.id}</Td>
                <Td>
                  <Input
                    width="100%"
                    placeholder="Search or enter item name"
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(index, "name", e.target.value)
                    }
                  />
                </Td>
                {isConsumable ? (
                  <Td>
                    <HStack>
                      <Text>₹</Text>
                      <Input
                        width="100%"
                        type="number"
                        value={item.totalPrice}
                        onChange={(e) =>
                          handleItemChange(index, "totalPrice", e.target.value)
                        }
                      />
                    </HStack>
                  </Td>
                ) : (
                  <>
                    <Td>
                      <Input
                        width="100%"
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          handleItemChange(index, "qty", e.target.value)
                        }
                      />
                    </Td>
                    <Td>
                      <HStack>
                        <Text>₹</Text>
                        <Input
                          width="100%"
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleItemChange(index, "unitPrice", e.target.value)
                          }
                        />
                      </HStack>
                    </Td>
                  </>
                )}
                <Td>₹{getRowTotal(item).toFixed(2)}</Td>
                <Td>
                  <Input
                    width="100%"
                    type="date"
                    value={item.requiredBy}
                    onChange={(e) =>
                      handleItemChange(index, "requiredBy", e.target.value)
                    }
                  />
                </Td>
                <Td>
                  <Select
                    width="100%"
                    value={item.priority}
                    onChange={(e) =>
                      handleItemChange(index, "priority", e.target.value)
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Select>
                </Td>
                <Td>
                  <Input
                    width="100%"
                    placeholder="Remarks"
                    value={item.remarks}
                    onChange={(e) =>
                      handleItemChange(index, "remarks", e.target.value)
                    }
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Divider my={4} />

        <HStack justifyContent="space-between">
          <Text>Total Items: {items.length}</Text>
          <Text fontWeight="bold">
            Total Estimated Cost: ₹{getTotalCost().toFixed(2)}
          </Text>
        </HStack>
      </Box>

      <HStack spacing={4} justifyContent="flex-end">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button colorScheme="blue">Next</Button>
      </HStack>
    </Box>
  );
}

export default ItemsToBeProcured;
