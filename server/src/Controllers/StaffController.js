import Requisition from "../Models/Requisition.js";

  // Staff
export const getApproverRequests = async (req, res) => {
  try {
    const { email } = req.user;

    if (!email) {
      return res.status(400).json({ message: "Approver email is required" });
    }

    const requisitions = await Requisition.find({ "generalDetails.approverEmail": email , "generalDetails.staffstatus" : "Pending" });

    console.log("Requisitions Found:", requisitions); 

    res.status(200).json(requisitions);
  } catch (error) {
    console.error("Error fetching requisitions:", error); 
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Staff
export const postApproverRequests = async (req, res) => {
  try {
    const { email } = req.user; 
    const { id } = req.params; 

    if (!email) {
      return res.status(400).json({ message: "Approver email is required" });
    }

    const updatedRequisition = await Requisition.findByIdAndUpdate(
      id, 
      { $set: { "generalDetails.staffstatus": "Approved" } }, 
      { new: true }
    );

    if (!updatedRequisition) {
      return res.status(404).json({ message: "Requisition not found" });
    }

    res.status(200).json({ message: "Requisition updated successfully", updatedRequisition });
  } catch (error) {
    console.error("Error updating requisition:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Staff
export const getApproverApproval = async (req, res) => {
  try {
    const { email } = req.user;

    if (!email) {
      return res.status(400).json({ message: "Approver email is required" });
    }

    const requisitions = await Requisition.find({"generalDetails.approverEmail": email , "generalDetails.staffstatus" : "Approved" });

    console.log("Requisitions Found:", requisitions); 

    res.status(200).json(requisitions);
  } catch (error) {
    console.error("Error fetching requisitions:", error); 
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

