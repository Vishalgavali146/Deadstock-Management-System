// --- keep your existing imports ---
import Department from "../Models/Department.js";
import { Equipment } from "../Models/Department.js";

// GET pending requests (returns an object to match frontend expectation)
export const getPendingRequestForLab = async (req, res) => {
  try {
    const { departmentId, labId, role } = req.user;

    let query;
    if (role === "HOD") {
      query = { departmentId, statusHOD: "Pending" };
    } else {
      query = { labNo: labId, statusLabIncharge: "Pending" };
    }

    const pendingRequests = await Equipment.find(query).populate({
      path: "eachEquipment",
      model: "EachEquipment",
    });

    console.log("Pending requests found:", pendingRequests?.length ?? 0);

    // return as an object so frontend can do response.data.pendingRequests
    return res.status(200).json({ pendingRequests });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET approved requests (you already returned an object — keep it)
export const getApprovedRequestsForLab = async (req, res) => {
  try {
    const { departmentId, labId, role } = req.user;

    let query = { departmentId };

    if (role === "HOD") {
      query.statusHOD = "Approve";
    } else {
      query.labNo = labId;
      query.statusLabIncharge = "Approve";
    }

    const approvedRequests = await Equipment.find(query).populate({
      path: "eachEquipment",
      model: "EachEquipment",
    });

    return res.status(200).json({ approvedRequests });
  } catch (error) {
    console.error("Error fetching approved requests:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Robust approve handler that tolerates dsr with slashes & accepts dsr via params/query/body
export const approveRequestUsingDSRNo = async (req, res) => {
  try {
    // Accept dsrNo from route param, query or body
    const rawDsrFromParam = req.params?.dsrNo;
    const rawDsrFromQuery = req.query?.dsrNo;
    const rawDsrFromBody = req.body?.dsrNo;
    const rawDsr = rawDsrFromParam ?? rawDsrFromQuery ?? rawDsrFromBody;

    // Logging for debug
    console.log("approveRequestUsingDSRNo - req.params:", req.params);
    console.log("approveRequestUsingDSRNo - rawDsr:", rawDsr);
    console.log("approveRequestUsingDSRNo - req.user:", req.user);

    const { departmentId, labId, role } = req.user || {};

    if (!departmentId) {
      return res
        .status(403)
        .json({ error: "Department ID is required to approve the request" });
    }

    if (!rawDsr) {
      return res
        .status(400)
        .json({ error: "DSR number is required to approve the request." });
    }

    // decode if encoded
    let dsrNo;
    try {
      dsrNo = decodeURIComponent(rawDsr);
    } catch (e) {
      dsrNo = rawDsr;
    }

    // Primary query: exact match
    let query = { dsrNo, departmentId };
    if (role !== "HOD") query.labNo = labId;

    console.log("Searching request using query:", query);
    let requestDoc = await Equipment.findOne(query);

    // If not found, try some fallbacks:
    if (!requestDoc) {
      // fallback 1: maybe frontend didn't decode and param still has %2F
      const maybeReplaced = rawDsr.replace(/%2F/gi, "/");
      if (maybeReplaced !== rawDsr) {
        requestDoc = await Equipment.findOne({
          dsrNo: maybeReplaced,
          departmentId,
          ...(role !== "HOD" ? { labNo: labId } : {}),
        });
      }
    }

    if (!requestDoc) {
      const safe = dsrNo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      requestDoc = await Equipment.findOne({
        dsrNo: { $regex: safe, $options: "i" },
        departmentId,
        ...(role !== "HOD" ? { labNo: labId } : {}),
      });
    }

    if (!requestDoc) {
      return res
        .status(404)
        .json({ error: `No request found with DSR No: ${dsrNo}` });
    }

    if (departmentId !== requestDoc.departmentId) {
      return res.status(403).json({
        error: "Access denied: You can only approve items for your own department",
      });
    }

    if (role === "HOD") {
      if (requestDoc.statusHOD === "Approve") {
        return res
          .status(400)
          .json({ error: "HOD has already approved the request" });
      }
      requestDoc.statusHOD = "Approve";
    } else {
      if (requestDoc.statusLabIncharge === "Approve") {
        return res.status(400).json({
          error: `Lab Incharge of Lab ${labId} has already approved the request`,
        });
      }
      requestDoc.statusLabIncharge = "Approve";
    }

    await requestDoc.save();

    if (
      requestDoc.statusHOD === "Approve" &&
      requestDoc.statusLabIncharge === "Approve"
    ) {
      const newEquipment = await Equipment.create({
        scrap: requestDoc.scrap,
        scrapOnDate: requestDoc.scrapOnDate,
        category: requestDoc.category,
        type: requestDoc.type,
        department: requestDoc.department,
        descriptionOfEquipment: requestDoc.descriptionOfEquipment,
        dsrNo: requestDoc.dsrNo,
        quantity: requestDoc.quantity,
        labDsrPageNo: requestDoc.labDsrPageNo,
        labDsrSrNo: requestDoc.labDsrSrNo,
        ddsrPageNo: requestDoc.ddsrPageNo,
        ddsrSrNo: requestDoc.ddsrSrNo,
        centralDeadstockSrRegNo: requestDoc.centralDeadstockSrRegNo,
        centralDeadstockPageNo: requestDoc.centralDeadstockPageNo,
        centralDeadstockSrSrNo: requestDoc.centralDeadstockSrSrNo,
        descriptionAsPerCentralDeadstock: requestDoc.descriptionAsPerCentralDeadstock,
        nameOfSupplier: requestDoc.nameOfSupplier,
        pageNo: requestDoc.pageNo,
        PODate: requestDoc.PODate,
        invoiceNo: requestDoc.invoiceNo,
        invoiceDate: requestDoc.invoiceDate,
        purchaseDate: requestDoc.purchaseDate,
        amount: requestDoc.amount,
        remarks: requestDoc.remarks,
        purchaseForLab: requestDoc.purchaseForLab,
        permanentlyTransferToLab: requestDoc.permanentlyTransferToLab,
        departmentId: requestDoc.departmentId,
        labNo: requestDoc.labNo,
        eachEquipment: requestDoc.eachEquipment,
      });

      const department = await Department.findOne({
        departmentCode: departmentId,
      }).populate("labs");
      const lab = department.labs.find((lab) => lab.labNo === requestDoc.labNo);

      if (!lab) {

        console.error("Lab not found in department while approving:", requestDoc.labNo);
      } else {
        lab.equipments.push(newEquipment._id);
        await lab.save();
      }
    }

    return res.status(200).json({
      message: "Request approved successfully",
      request: requestDoc,
    });
  } catch (error) {
    console.error("Error approving request:", error);
    return res.status(500).json({ error: error.message });
  }
};
