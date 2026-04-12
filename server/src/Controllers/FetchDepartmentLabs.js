import Department from "../Models/Department.js";

export const getDepartmentWithLabs = async (req, res) => {
  try {
    const { departmentId } = req.user;
    console.log("departmentId", departmentId);

    const department = await Department.findOne({
      departmentCode: departmentId,
    }).populate("labs");

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    if (department.labs.length === 0) {
      return res
        .status(200)
        .json({ message: "No labs for this department", department });
    }

    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEquipmentForLab = async (req, res) => {
  try {
    const { departmentId, labId, role } = req.user;

    const department = await Department.findOne({
      departmentCode: departmentId,
    }).populate({
      path: "labs",
      populate: {
        path: "equipments",
        // model: "Equipment",
        populate: {
          path: "eachEquipment",
          // model: "EachEquipment",
        },
      },
    });

    console.log("departmentId:", departmentId);

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    let labs = [];

    if (role === "HOD") {
      labs = department.labs.map((lab) => ({
      labName: lab.labName,
      equipments: lab.equipments,
      }));   
    }
    
    else {
      labs = department.labs
      .filter((lab) => lab.labNo === labId)
      .map((lab) => ({
      labName: lab.labName,
      equipments: lab.equipments,
    }));

    if (labs.length === 0) {
      return res.status(404).json({
        error: `Lab '${labId}' not found in department '${departmentId}'`,
      });
    }
  }

    return res.status(200).json({ labs });
  } catch (error) {
    console.error("Error fetching lab equipment:", error);
    res.status(500).json({ error: error.message });
  }
};

