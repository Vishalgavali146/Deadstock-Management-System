import Department from "../Models/Department.js";
import {
  HistoryCardOFEquipment,
  EachEquipment,
  Equipment,
  Lab,
} from "../Models/Department.js";

export const 
createDepartment = async (req, res) => {
  try {
    const { departmentName, departmentCode } = req.body;

    const existingDepartment = await Department.findOne({ departmentCode });
    if (existingDepartment) {
      return res.status(409).json({ error: "Department already exists" });
    }

    const department = await Department.create({
      departmentName,
      departmentCode,
    });

    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//--------------------------------------------------------------------
export const createLab = async (req, res) => {
  try {
    const { labName, labNo } = req.body;

    const { departmentId } = req.user;

    
    const department = await Department.findOne({
      departmentCode: departmentId,
    }); 

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const existingLab = await Lab.findOne({
      labName : labName,
      labNo : labNo,
      _id: { $in: department.labs },
    });

    if (existingLab) {
      return res
        .status(409)
        .json({ error: "Lab already exists in this department" });
    }

    const newLab = await Lab.create({
      labName,
      labNo,
      department: departmentId,
    });

    department.labs.push(newLab._id);
    await department.save();

    res.status(201).json({ message: "Lab added to department", lab: newLab });
  } catch (error) {
    console.error("Error adding lab:", error);
    res.status(500).json({ error: error.message });
  }
};

//----------------------------------------------------------------------------------------
export const createEquipmentForLab = async (req, res) => {
  try {
    const { departmentId, labId } = req.params;
    const {
      dsrNo,
      quantity,
      remarks,
      ddsrPageNo,
      ddsrSrNo,
      nameOfSupplier,
      ...rest
    } = req.body;

    const department = await Department.findOne({
      departmentCode: departmentId,
    }).populate("labs");

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const lab = department.labs.find((lab) => lab.labNo === labId);

    if (!lab) {
      return res.status(404).json({
        error: `Lab '${labId}' not found in department '${departmentId}'`,
      });
    }

    const existingEquipment = await Equipment.findOne({
      dsrNo,
      purchaseForLab: lab._id,
    });

    if (existingEquipment) {
      return res.status(400).json({
        error: `Equipment with DSR No '${dsrNo}' already exists in lab '${labId}'`,
      });
    }

    const newEquipment = await Equipment.create({
      ...rest,
      dsrNo,
      quantity,
      remarks,
      ddsrPageNo,
      ddsrSrNo,
      nameOfSupplier,
      purchaseForLab: lab.labName,
      department: department.departmentName,
    });

    let eachEquipmentArray = [];
    for (let i = 1; i <= quantity; i++) {
      eachEquipmentArray.push({
        dsr_no: `${dsrNo}/${i}`,
        remarks,
        room_no: labId,
        serial_no: i.toString(),
        ddsrPageNo,
        ddsrSrNo,
        nameOfSupplier,
      });
    }

    const createdEachEquipment = await EachEquipment.insertMany(
      eachEquipmentArray
    );

    console.log(createdEachEquipment);

    newEquipment.eachEquipment = createdEachEquipment.map((eq) => eq._id);
    await newEquipment.save();

    lab.equipments.push(newEquipment._id);
    await lab.save();

    res.status(201).json({
      message: "Equipment added to lab successfully",
      equipment: newEquipment,
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const addHistoryCard = async (req, res) => {
  try {

    const { equipmentId } = req.params;
    const {
      dsrNo,
      date,
      problemObserved,
      remedyTaken,
      remark,
      labEquipmentDetails,
      srNo,
      supplierDetails,
    } = req.body;
    
    const newHistoryCard = await HistoryCardOFEquipment.create({
      dsrNo,
      date,
      problemObserved,
      remedyTaken,
      remark,
      labEquipmentDetails,
      srNo,
      supplierDetails,
    });
    
    const updatedEquipment = await EachEquipment.findByIdAndUpdate(
      equipmentId,
      { $push: { history: newHistoryCard._id } },
      { new: true }
    );
    
    return res.status(201).json({
      message: "History card added successfully",
      historyCard: newHistoryCard,
      equipment: updatedEquipment,
    });
    
  } catch (error) {
  console.error("Error adding history card:", error);
  return res.status(400).json({ error: error.message, details: error });
}
};

export const getHistoryCards = async (req, res) => {
  try {
    const { equipmentId } = req.params;
    const equipment = await EachEquipment.findById(equipmentId).populate("history");
    if (!equipment) {
      return res.status(404).json({ error: "Equipment not found" });
    }
    res.status(200).json({ history: equipment.history });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const toggleEquipmentStatus = async (req, res) => {
  try {
    const { id } = req.params; // Equipment _id
    const equipment = await EachEquipment.findById(id);
    if (!equipment) {
      return res.status(404).json({ error: "Equipment not found" });
    }

    // Toggle status
    equipment.status = equipment.status === "Working" ? "Not Working" : "Working";
    await equipment.save();

    res.status(200).json({
      message: "Equipment status toggled successfully",
      equipment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};