  export const validateRequisitionForm = (requisitionData, toast) => {
  const {
    requisitionNumber,
    date,
    to,
    reference,
    requesterName,
    requesterPhone,
    roomNo,
    approverName,
    approverEmail,
    approverRole,
    category,
  } = requisitionData.generalDetails;

  const {
    SanctionBudget,
    BalanceAmount,
    ApproximateAmount,
    AmountSpent,
  } = requisitionData.approval;

  const showError = (message) => {
    toast({
      title: "Missing Field",
      description: message,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  if (!requisitionNumber.trim()) return showError("You have not filled the requisition number.");
  if (!date.trim()) return showError("You have not filled the date.");
  if (!to.trim()) return showError("You have not filled the 'To' field.");
  if (!reference.trim()) return showError("You have not filled the reference.");
  if (!requesterName.trim()) return showError("You have not filled the requester name.");
  if (!requesterPhone.trim()) return showError("You have not filled the requester phone.");
  if (!roomNo.trim()) return showError("You have not filled the room number.");
  if (!approverName.trim()) return showError("You have not filled the approver name.");
  if (!approverEmail.trim()) return showError("You have not filled the approver email.");
  if (!approverRole.trim()) return showError("You have not filled the approver role.");
  if (!category.trim()) return showError("You have not selected the category.");

  if (requisitionData.items.length === 0) {
    return showError("You must add at least one item.");
  }

  for (let i = 0; i < requisitionData.items.length; i++) {
    const item = requisitionData.items[i];
    if (!item.name?.trim()) return showError(`Item ${i + 1}: name is required.`);
    if (!item.qty || item.qty <= 0) return showError(`Item ${i + 1}: quantity must be greater than 0.`);
    if (!item.unitPrice || item.unitPrice <= 0) return showError(`Item ${i + 1}: unit price must be greater than 0.`);
  }

  if (!ApproximateAmount || ApproximateAmount <= 0) return showError("You have not filled the approximate amount.");
  if (!SanctionBudget || SanctionBudget <= 0) return showError("You have not filled the sanctioned budget.");
  if (!BalanceAmount || BalanceAmount <= 0) return showError("You have not filled the balance amount.");
  if (AmountSpent == null || AmountSpent < 0) return showError("You have not filled the amount spent.");

  return true;
};
