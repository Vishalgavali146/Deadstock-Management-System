import User from "../Models/User-Models.js";

export const RequestApprove = async (req, res) => {
  const { email, LabId, role } = req.body;


  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.status !== "Pending") {
      return res.status(400).json({ message: "Request already processed." });
    }

    const existingUser = await User.findOne({ LabId, role, status: "Approved" });
    if (existingUser) {
      return res.status(400).json({ message: `Lab ${LabId} is already allocated to a user with role ${role}.` });
    }


    const updatedUser = await User.findOneAndUpdate(
    { email },
    { status: "Approved", LabId: LabId, role: role },
    { new: true }
  );


    //By default, findOneAndUpdate() returns the original document before the update.
    //But if you set { new: true }, it will return the document after the update — i.e., 
    // the fresh, updated data.


  res.status(200).json({ 
    message: "User approved successfully.", 
    user: updatedUser 
  });

  } catch (err) {
    console.error("Error approving request:", err);
    res.status(500).json({ message: "Error approving request.", error: err.message });
  }
};

export const PendingRequests = async (req, res) => {
  const { departmentId } = req.user;

  try {
    const pendingRequests = await User.find({
      DepartmentId: departmentId,
      status: "Pending",
    }).select("-password -_v");


    const totalUsers = await User.countDocuments({ DepartmentId: departmentId });

    const verifiedUsers = await User.countDocuments({
      DepartmentId: departmentId,
      status: "Approved",
    });


    return res.status(200).json({
      msg: pendingRequests.length === 0 ? "No pending requests" : "Requests are:",
      pendingRequests,
      totalUsers,
      verifiedUsers,
      pendingUsers: pendingRequests.length,
    });

  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const ApprovedUsers = async (req, res) => {
  const { departmentId } = req.user;

  try {

    const approvals = await User.find({
      DepartmentId: departmentId,
      status: "Approved",
    }).select("-password -__v");


    if (approvals.length === 0) {
      return res.status(200).json({ msg: "No approved users" });
    }

    return res.status(200).json({
      msg: "Approved users:",
      approvals,
    });

  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
