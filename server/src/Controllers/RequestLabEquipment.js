import Department from "../Models/Department.js";
import {
  EachEquipment,
  Equipment,
  Lab,  
} from "../Models/Department.js";

export const createEquipmentRequestForLab = async (req, res) => {
  try {
    const { departmentId } = req.user;
    const {
      dsrNo,
      quantity,
      remarks,
      ddsrPageNo,
      ddsrSrNo,
      nameOfSupplier,
      purchaseForLab,
      labNo,
      ...rest
    } = req.body;

    const department = await Department.findOne({
      departmentCode: departmentId,
    });

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const lab = await Lab.findOne({
      labNo: labNo,
      _id: { $in: department.labs },
    });

    if (!lab) {
      return res.status(404).json({
        error: `Lab '${labNo}' not found in department '${departmentId}'`,
      });
    }

    const existingEquipment = await Equipment.findOne({
      dsrNo,
      departmentId,
    });

    if (existingEquipment) {
      return res.status(400).json({
        error: `Equipment with DSR No '${dsrNo}' already exists in department '${department.departmentName}'.`,
      });
    }

    const newRequest = await Equipment.create({
      ...rest,
      dsrNo,
      quantity,
      remarks,
      ddsrPageNo,
      ddsrSrNo,
      nameOfSupplier,
      labNo,
      purchaseForLab: lab.labName,
      department: department.departmentName,
      departmentId,
    });

    let eachEquipmentArray = [];
    for (let i = 1; i <= quantity; i++) {
      eachEquipmentArray.push({
        dsr_no: `${dsrNo}/${i}`,
        remarks,
        room_no: labNo,
        serial_no: i.toString(),
        ddsrPageNo,
        ddsrSrNo,
        nameOfSupplier,
      });
    }

    const createdEachEquipment = await EachEquipment.insertMany(
      eachEquipmentArray
    );

    newRequest.eachEquipment = createdEachEquipment.map((eq) => eq._id);
    await newRequest.save();

    res.status(201).json({
      message: "Equipment added in lab request successfully",
      equipment: newRequest,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


