import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "../Container.css";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { ClipboardList, Save, X } from "lucide-react";

const initialState = {
  scrap: "",
  scrapOnDate: "",
  category: "",
  type: "",
  department: "",
  descriptionOfEquipment: "",
  dsrNo: "",
  quantity: "",
  labDsrPageNo: "",
  labDsrSrNo: "",
  ddsrPageNo: "",
  ddsrSrNo: "",
  centralDeadstockSrRegNo: "",
  centralDeadstockPageNo: "",
  centralDeadstockSrSrNo: "",
  descriptionAsPerCentralDeadstock: "",
  nameOfSupplier: "",
  pageNo: "",
  PODate: "",
  invoiceNo: "",
  invoiceDate: "",
  purchaseDate: "",
  amount: "",
  remarks: "",
  permanentlyTransferToLab: "",
  labNo: "",
  purchaseForLab: "",
};

// Reusable field wrapper
const FormField = ({ label, children }) => (
  <div className="column">
    <label>{label}</label>
    {children}
  </div>
);

export default function AllocationStatistics() {
  const toast = useToast();
  const [statisticsData, setStatisticsData] = useState(initialState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      console.log(decoded);
      const userDepartment = decoded?.departmentId || "";
      setStatisticsData((prev) => ({
        ...prev,
        department: userDepartment,
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStatisticsData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        toast({
          title: "Authentication error",
          description: "No token found. Please login.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/department/equipment`,
        statisticsData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("API Response:", response.data);

      toast({
        title: "Equipment Added",
        description: "Equipment record submitted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      setStatisticsData(initialState);
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response?.data || error.message
      );
      toast({
        title: "Submission failed",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <div style={{ width: 40, height: 40, background: "var(--color-primary-bg)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ClipboardList size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            Add Equipment Record
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 1 }}>
            Fill in all details to register a new equipment entry
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Card wrapper */}
        <div style={{ background: "#ffffff", borderRadius: "var(--radius-xl)", border: "1px solid var(--surface-border)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--surface-border)", background: "#f8fafc" }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", margin: 0 }}>
              Equipment Details
            </h2>
          </div>
          <div style={{ padding: 24 }}>
            {/* Row 1 */}
            <div className="row">
              <FormField label="Scrap (Y/N)">
                <select name="scrap" className="input-field" value={statisticsData.scrap} onChange={handleInputChange}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </FormField>
              <FormField label="Scrap on Date">
                <input type="date" name="scrapOnDate" className="input-field" value={statisticsData.scrapOnDate} onChange={handleInputChange} />
              </FormField>
            </div>

            {/* Row 2 */}
            <div className="row">
              <FormField label="Category">
                <select name="category" className="input-field" value={statisticsData.category} onChange={handleInputChange}>
                  <option value="">Select</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Consumables">Consumables</option>
                </select>
              </FormField>
              <FormField label="Type">
                <input type="text" name="type" className="input-field" value={statisticsData.type} onChange={handleInputChange} />
              </FormField>
            </div>

            {/* Row 3 */}
            <div className="row">
              <FormField label="Department">
                <input type="text" name="department" className="input-field" value={statisticsData.department} onChange={handleInputChange} />
              </FormField>
              <FormField label="Description of Equipment">
                <input type="text" name="descriptionOfEquipment" className="input-field" value={statisticsData.descriptionOfEquipment} onChange={handleInputChange} />
              </FormField>
            </div>

            {/* Row 4 */}
            <div className="row">
              <FormField label="DSR No.">
                <input type="text" name="dsrNo" className="input-field" value={statisticsData.dsrNo} onChange={handleInputChange} />
              </FormField>
              <FormField label="Quantity">
                <input type="number" name="quantity" className="input-field" value={statisticsData.quantity} onChange={handleInputChange} />
              </FormField>
            </div>

            {/* Row 5 */}
            <div className="row">
              <FormField label="Lab DSR Page No">
                <input type="number" name="labDsrPageNo" className="input-field" value={statisticsData.labDsrPageNo} onChange={handleInputChange} />
              </FormField>
              <FormField label="Lab DSR Sr No">
                <input type="number" name="labDsrSrNo" className="input-field" value={statisticsData.labDsrSrNo} onChange={handleInputChange} />
              </FormField>
            </div>

            {/* Row 6 */}
            <div className="row">
              <FormField label="DDSR Page No">
                <input type="number" name="ddsrPageNo" className="input-field" value={statisticsData.ddsrPageNo} onChange={handleInputChange} />
              </FormField>
              <FormField label="DDSR Sr No">
                <input type="number" name="ddsrSrNo" className="input-field" value={statisticsData.ddsrSrNo} onChange={handleInputChange} />
              </FormField>
            </div>

            {/* Row 7 */}
            <div className="row">
              <FormField label="Central Deadstock Sr Reg No">
                <input name="centralDeadstockSrRegNo" className="input-field" value={statisticsData.centralDeadstockSrRegNo} onChange={handleInputChange} />
              </FormField>
              <FormField label="Central Deadstock Page No">
                <input type="number" name="centralDeadstockPageNo" className="input-field" value={statisticsData.centralDeadstockPageNo} onChange={handleInputChange} />
              </FormField>
            </div>

            {/* Row 8 */}
            <div className="row">
              <FormField label="Central Deadstock Sr Sr No">
                <input type="number" name="centralDeadstockSrSrNo" className="input-field" value={statisticsData.centralDeadstockSrSrNo} onChange={handleInputChange} />
              </FormField>
              <FormField label="Description as Per Central Deadstock">
                <input type="text" name="descriptionAsPerCentralDeadstock" className="input-field" value={statisticsData.descriptionAsPerCentralDeadstock} onChange={handleInputChange} />
              </FormField>
            </div>

            {/* Row 9 */}
            <div className="row">
              <FormField label="Name of Supplier">
                <input type="text" name="nameOfSupplier" className="input-field" value={statisticsData.nameOfSupplier} onChange={handleInputChange} />
              </FormField>
              <FormField label="Page No">
                <input type="number" name="pageNo" className="input-field" value={statisticsData.pageNo} onChange={handleInputChange} />
              </FormField>
            </div>

            {/* Row 10 */}
            <div className="row">
              <FormField label="PO Date">
                <input type="date" name="PODate" className="input-field" value={statisticsData.PODate} onChange={handleInputChange} />
              </FormField>
              <FormField label="Invoice No.">
                <input type="text" name="invoiceNo" className="input-field" value={statisticsData.invoiceNo} onChange={handleInputChange} />
              </FormField>
            </div>

            {/* Row 11 */}
            <div className="row">
              <FormField label="Invoice Date">
                <input type="date" name="invoiceDate" className="input-field" value={statisticsData.invoiceDate} onChange={handleInputChange} />
              </FormField>
              <FormField label="Purchase Date">
                <input type="date" name="purchaseDate" className="input-field" value={statisticsData.purchaseDate} onChange={handleInputChange} />
              </FormField>
            </div>

            {/* Row 12 */}
            <div className="row">
              <FormField label="Amount">
                <input type="number" name="amount" className="input-field" value={statisticsData.amount} onChange={handleInputChange} />
              </FormField>
              <FormField label="Remarks">
                <input type="text" name="remarks" className="input-field" value={statisticsData.remarks} onChange={handleInputChange} />
              </FormField>
            </div>

            {/* Row 13 */}
            <div className="row">
              <FormField label="Lab No">
                <input type="text" name="labNo" className="input-field" value={statisticsData.labNo} onChange={handleInputChange} />
              </FormField>
              <FormField label="Permanently Transfer to Lab">
                <input type="text" name="permanentlyTransferToLab" className="input-field" value={statisticsData.permanentlyTransferToLab} onChange={handleInputChange} />
              </FormField>
            </div>

            {/* Row 14 */}
            <div className="row" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <FormField label="Purchase for Lab">
                <input type="text" name="purchaseForLab" className="input-field" onChange={handleInputChange} value={statisticsData.purchaseForLab} />
              </FormField>
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ padding: "16px 24px", borderTop: "1px solid var(--surface-border)", background: "#f8fafc", display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setStatisticsData(initialState)}
            >
              <X size={14} /> Reset
            </button>
            <button type="submit" className="save-btn">
              <Save size={14} /> Save Equipment
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
