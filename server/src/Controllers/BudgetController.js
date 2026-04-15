import Department from "../Models/Department.js";

export const getBudget = async (req, res) => {
  try {
    const { departmentId } = req.user;
    
    if (!departmentId) {
      return res.status(404).json({ msg: "Department ID is required" });
    }

    const response = await Department.findOne({ departmentCode: departmentId });

    if (!response) {
      return res.status(404).json({ msg: "Department not found" });
    }

    res.status(200).json({ msg: response.budget });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


export const updateBudget = async (req, res) => {
  try { 
    const { departmentId } = req.user;
    if (!departmentId) {
      return res.status(400).json({ message: "Department not found in token" });
    }

    const { equipment, furniture, consumables , SanctionBudget } = req.body;
    if (isNaN(equipment) || isNaN(furniture) || isNaN(consumables)) {
      return res.status(400).json({ message: "Invalid budget values" });
    }

   const updatedDepartment = await Department.findOneAndUpdate(
    { departmentCode: departmentId },
    { $set: { "budget.equipment": equipment, "budget.furniture": furniture, "budget.consumables": consumables , "budget.SanctionAmount" : SanctionBudget} },
    { new: true }
  );

    if (!updatedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ msg: updatedDepartment.budget });
  } catch (error) {
    console.error("Update budget error:", error);
    res.status(500).json({ message: error.message });
  }
};

