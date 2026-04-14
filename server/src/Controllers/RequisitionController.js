import Requisition from "../Models/Requisition.js";
import Department from "../Models/Department.js";


// What if someone reject it
export const createRequisition = async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    const requisition = await Requisition.create(req.body);
    res.status(201).json({ message: "Requisition submitted successfully!", requisition });
  } catch (error) {
  console.error("Error creating requisition:", error.message, error.stack);
  res.status(500).json({ error: "Internal Server Error", details: error.message });
}
};

export const getRequisitions = async (req, res) => {
  try {
    const { role, departmentId, labId } = req.user;

    let requisitions;

    if (role === "Central_DSR_Incharge") {
      requisitions = await Requisition.find({
        StatusHOD: "Approved",
        Status: "Pending"
      });
    }
    else if (role === "HOD") {
      requisitions = await Requisition.find({
        StatusHOD: "Pending",
        "generalDetails.staffstatus": "Approved",
        StatusLabIncharge: "Approved",
        "generalDetails.from" : departmentId
      })
    }
    else if (role === "Lab_Incharge") {
      requisitions = await Requisition.find({
        StatusLabIncharge: "Pending",
        "generalDetails.roomNo": labId
      })
    }
    else if (role === "DSR_Incharge") {
      requisitions = await Requisition.find({
        "generalDetails.from": departmentId,
        Status: "Approved",
        StatusDSR: "Pending",
      });
    } else if(role === "Lab_Assistance") {
      requisitions = await Requisition.find({
        "generalDetails.roomNo": labId,
      });
    }
    console.log("Requisitions found:", requisitions);
    return res.status(200).json(requisitions);
  } catch (error) {
    console.error("Error fetching requisitions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const approveRequisitionByRole = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    if (!id) {
      return res.status(400).json({ msg: "Requisition ID is required." });
    }

    const requisition = await Requisition.findById(id);
    if (!requisition) {
      return res.status(404).json({ msg: "Requisition not found." });
    }

    let updateData = {};
    if (userRole === "Central_DSR_Incharge") {
      updateData.Status = "Approved";

      const { BalanceAmount, AmountSpent } = requisition.approval;
      const { category, from } = requisition.generalDetails;

      const department = await Department.findOne({ departmentCode: from });
      if (!department) {
        return res.status(404).json({ msg: "Department not found." });
      }

      const categoryKey = category.toLowerCase();

      if (
        department.budget.hasOwnProperty(categoryKey) &&
        typeof department.budget[categoryKey] === "number"
      ) {
        department.budget[categoryKey] -= BalanceAmount;
        department.budget.AmountSpent -= BalanceAmount;

        await department.save();

        requisition.approval.AmountSpent = AmountSpent - BalanceAmount;

        await requisition.save();
      } else {
        return res.status(400).json({ msg: `Invalid category '${category}' in department budget.` });
      }
    } else if (userRole === "DSR_Incharge") {
      updateData.StatusDSR = "Approved";
    } else if (userRole === "Lab_Incharge") {
      updateData.StatusLabIncharge = "Approved";
    } else if (userRole === "HOD") {
      updateData.StatusHOD = "Approved";
    } else {
      return res.status(403).json({ msg: "Not authorized to approve requisitions." });
    }

    const updatedRequisition = await Requisition.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({
      msg: "Requisition approved successfully.",
      requisition: updatedRequisition,
    });
  } catch (error) {
    console.error("Error approving requisition:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


export const getRequisitionsApproved = async (req, res) => {
  try {
    const { role, departmentId , labId} = req.user;
    let requisitions;

    if (role === "Central_DSR_Incharge") {
      requisitions = await Requisition.find({ Status: "Approved" });
    } else if (role === "DSR_Incharge") {
      requisitions = await Requisition.find({
        "generalDetails.from": departmentId,
        StatusDSR: "Approved",
      });
    }
    else if (role === "HOD") {
      requisitions = await Requisition.find({
        "generalDetails.from": departmentId,
        StatusHOD: "Approved",
      });
    }
    else if (role === "Lab_Incharge") {
      requisitions = await Requisition.find({
        "generalDetails.roomNo": labId,
        StatusLabIncharge: "Approved",
      });
    }else {
      return res.status(403).json({ error: "Access denied" });
    }
    console.log("requisitions" , requisitions);
    return res.status(200).json(requisitions);
  } catch (error) {
    console.error("Error fetching requisitions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};






// const roleQueries = {
//   Central_DSR_Incharge: { StatusHOD: "Approved", Status: "Pending" },
//   HOD: {
//     StatusHOD: "Pending",
//     "generalDetails.staffstatus": "Approved",
//     StatusLabIncharge: "Approved",
//   },
//   Lab_Incharge: (labId) => ({ StatusLabIncharge: "Pending", "generalDetails.roomNo": labId }),
//   DSR_Incharge: (departmentId) => ({
//     "generalDetails.from": departmentId,
//     Status: "Approved",
//     StatusDSR: "Pending",
//   }),
//   Lab_Assistance: (labId) => ({ "generalDetails.roomNo": labId }),
// };


// export const getRequisitions = async (req, res) => {
//   try {
//     const { role, departmentId, labId } = req.user;

//     let query = roleQueries[role];
//     if (!query) {
//       return res.status(403).json({ error: "Access denied" });
//     }

//     // If query is a function, pass params
//     if (typeof query === "function") {
//       query = query(role === "Lab_Incharge" ? labId : departmentId);
//     }

//     const requisitions = await Requisition.find(query);
//     return res.status(200).json(requisitions);
//   } catch (error) {
//     console.error("Error fetching requisitions:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };



