import mongoose from "mongoose";


//-------------------------------------------------------------------

const HistoryCardOFEquipmentSchema = new mongoose.Schema({
  dsrNo: { type: String, required: true },
  date: { type: String, required: true },
  problemObserved: { type: String, required: true },
  remedyTaken: { type: String, required: true },
  remark: { type: String, required: true },
  labEquipmentDetails: { type: String, required: true },
  srNo: { type: String, required: true },
  supplierDetails: { type: String, required: true },
});

const EachEquipmentSchema = new mongoose.Schema({
  dsr_no: { type: String, required: true },
  remarks: { type: String, required: true },
  room_no: { type: String, required: true },
  serial_no: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Working", "Not Working"],
    default: "Working",
  },
  ddsrPageNo: { type: Number },
  ddsrSrNo: { type: Number },
  nameOfSupplier: { type: String },
  history: [
    { type: mongoose.Schema.Types.ObjectId, ref: "HistoryCardOFEquipment" },
  ],
});

const EquipmentSchema = new mongoose.Schema({
  scrap: { type: String, enum: ["Yes", "No"], required: true },
  scrapOnDate: { type: String },
  category: { type: String, required: true },
  type: { type: String },
  descriptionOfEquipment: { type: String, required: true },
  dsrNo: { type: String },
  quantity: { type: Number, required: true },
  labDsrPageNo: { type: Number },
  labDsrSrNo: { type: Number },
  ddsrPageNo: { type: Number },
  ddsrSrNo: { type: Number },
  centralDeadstockSrRegNo: {
  type: String,
  required: true
},
  centralDeadstockPageNo: { type: Number },
  centralDeadstockSrSrNo: { type: Number },
  descriptionAsPerCentralDeadstock: { type: String },
  nameOfSupplier: { type: String },
  pageNo: { type: Number },
  PODate: { type: String },
  invoiceNo: { type: String },
  invoiceDate: { type: String },
  purchaseDate: { type: String },
  amount: { type: Number },
  remarks: { type: String },
  purchaseForLab: { type: String },
  permanentlyTransferToLab: { type: String },

  labNo: { type: String },
  department: { type: String, required: true },
  departmentId: { type: String },

  eachEquipment: [
    { type: mongoose.Schema.Types.ObjectId, ref: "EachEquipment" },
  ],

  statusHOD: { type: String, enum: ["Pending", "Approve"], default: "Pending" },
  statusLabIncharge: {
    type: String,
    enum: ["Pending", "Approve"],
    default: "Pending",
  },
});


const LabSchema = new mongoose.Schema({
  labName: {type: String, required: true },
  labNo: {type: String, required : true },
  // department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  department: { type : String },
  equipments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Equipment" }],
});

const departmentSchema = new mongoose.Schema({
  departmentName: { type: String, required: true },
  departmentCode: { type: String, required: true },
    budget: {
    equipment: { type: Number, default: 0 },
    furniture: { type: Number, default: 0 }, 
    consumables: { type: Number, default: 0 },
    SanctionAmount: { type: Number, default: 0 }
  },
  labs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lab" }],
});


export const HistoryCardOFEquipment = mongoose.model(
  "HistoryCardOFEquipment",
  HistoryCardOFEquipmentSchema
);
export const EachEquipment = mongoose.model(
  "EachEquipment",
  EachEquipmentSchema
);

export const Equipment = mongoose.model("Equipment",EquipmentSchema);
export const Lab = mongoose.model("Lab", LabSchema);
export const Department = mongoose.model("Department", departmentSchema);

export default Department;
