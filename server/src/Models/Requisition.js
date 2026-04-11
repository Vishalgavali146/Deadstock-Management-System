import mongoose from "mongoose";

const RequisitionSchema = new mongoose.Schema({
  generalDetails: {
    requisitionNumber: { type: String, required: true },
    date: { type: Date, required: true },
    to: { type: String, required: true },
    from: { type: String, required: true },
    reference: { type: String },
    requesterName: { type: String, required: true },
    requesterEmail: { type: String, required: true },
    requesterPhone: { type: String },
    requesterRole: { type: String, required: true }, 
    roomNo: { type: String, required: true },
    approverName: { type: String, required: true },
    approverEmail: { type: String, required: true },
    approverRole: { type: String, required: true },
    category: {type : String , required: true},
    staffstatus: {
      type: String,
      enum: ["Pending", "Approved"],
      default: "Pending",
    },
  },
  items: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
      requiredBy: { type: Date, required: true },
      priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium",
      },
      remarks: { type: String },
    },
  ],
  approval: {
    SanctionBudget: { type: Number, required: true },
    BalanceAmount: { type: Number, required: true },
    ApproximateAmount: { type: Number, required: true },
    additionalNotes: { type: String },
    attachment: { type: String },
    AmountSpent : {type:Number}
  },


  createdAt: { type: Date, default: Date.now },
  Status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  StatusDSR: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  StatusLabIncharge: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  StatusHOD: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

const Requisition = mongoose.model("Requisition", RequisitionSchema);
export default Requisition;
