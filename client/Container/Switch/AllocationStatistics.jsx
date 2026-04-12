import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "../Container.css";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

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
        `http://localhost:5000/api/department/equipment`,
        statisticsData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("API Response:", response.data);

      toast({
        title: "Success",
        description: "Submitted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
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
      });
    }
  };


  return (
    <div className="form-container">
      <form className="form-content" onSubmit={handleSubmit}>
        <h2>Allocation Statistics</h2>

        {/* Row 1: Scrap and Scrap On Date */}
        <div className="row">
          <div className="column">
            <label>Scrap (Y/N)</label>
            <select
              name="scrap"
              className="input-field"
              value={statisticsData.scrap}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div className="column">
            <label>Scrap on Date</label>
            <input
              type="date"
              name="scrapOnDate"
              className="input-field"
              value={statisticsData.scrapOnDate}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Row 2: Category and Type */}
        <div className="row">
          <div className="column">
            <label>Category</label>
            <select
              name="category"
              className="input-field"
              value={statisticsData.category}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Equipment">Equipment</option>
              <option value="Furniture">Furniture</option>
              <option value="Consumables">Consumables</option>
            </select>
          </div>
          <div className="column">
            <label>Type</label>
            <input
              type="text"
              name="type"
              className="input-field"
              value={statisticsData.type}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Row 3: Department and Description of Equipment */}
        <div className="row">
          <div className="column">
            <label>Department</label>
            <input
              type="text"
              name="department"
              className="input-field"
              value={statisticsData.department}
              onChange={handleInputChange}
            />
          </div>
          <div className="column">
            <label>Description of Equipment</label>
            <input
              type="text"
              name="descriptionOfEquipment"
              className="input-field"
              value={statisticsData.descriptionOfEquipment}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Row 4: DSR No. and Quantity */}
        <div className="row">
          <div className="column">
            <label>DSR No.</label>
            <input
              type="text"
              name="dsrNo"
              className="input-field"
              value={statisticsData.dsrNo}
              onChange={handleInputChange}
            />
          </div>
          <div className="column">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              className="input-field"
              value={statisticsData.quantity}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Row 5: Lab DSR Page No and Lab DSR Sr No */}
        <div className="row">
          <div className="column">
            <label>Lab DSR Page No</label>
            <input
              type="number"
              name="labDsrPageNo"
              className="input-field"
              value={statisticsData.labDsrPageNo}
              onChange={handleInputChange}
            />
          </div>
          <div className="column">
            <label>Lab DSR Sr No</label>
            <input
              type="number"
              name="labDsrSrNo"
              className="input-field"
              value={statisticsData.labDsrSrNo}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Row 6: Ddsr Page No and Ddsr Sr No */}
        <div className="row">
          <div className="column">
            <label>Ddsr Page No</label>
            <input
              type="number"
              name="ddsrPageNo"
              className="input-field"
              value={statisticsData.ddsrPageNo}
              onChange={handleInputChange}
            />
          </div>
          <div className="column">
            <label>Ddsr Sr No</label>
            <input
              type="number"
              name="ddsrSrNo"
              className="input-field"
              value={statisticsData.ddsrSrNo}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Row 7: Central Deadstock Sr Reg No and Central Deadstock Page No */}
        <div className="row">
          <div className="column">
            <label>Central Deadstock Sr Reg No</label>
            <input
              name="centralDeadstockSrRegNo"
              className="input-field"
              value={statisticsData.centralDeadstockSrRegNo}
              onChange={handleInputChange}
            />
          </div>
          <div className="column">
            <label>Central Deadstock Page No</label>
            <input
              type="number"
              name="centralDeadstockPageNo"
              className="input-field"
              value={statisticsData.centralDeadstockPageNo}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Row 8: Central Deadstock Sr Sr No and Description as Per Central Deadstock */}
        <div className="row">
          <div className="column">
            <label>Central Deadstock Sr Sr No</label>
            <input
              type="number"
              name="centralDeadstockSrSrNo"
              className="input-field"
              value={statisticsData.centralDeadstockSrSrNo}
              onChange={handleInputChange}
            />
          </div>
          <div className="column">
            <label>Description as Per Central Deadstock</label>
            <input
              type="text"
              name="descriptionAsPerCentralDeadstock"
              className="input-field"
              value={statisticsData.descriptionAsPerCentralDeadstock}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Row 9: Name of Supplier and Page No */}
        <div className="row">
          <div className="column">
            <label>Name of Supplier</label>
            <input
              type="text"
              name="nameOfSupplier"
              className="input-field"
              value={statisticsData.nameOfSupplier}
              onChange={handleInputChange}
            />
          </div>
          <div className="column">
            <label>Page No</label>
            <input
              type="number"
              name="pageNo"
              className="input-field"
              value={statisticsData.pageNo}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Row 10: PO Date and Invoice No */}
        <div className="row">
          <div className="column">
            <label>PO Date</label>
            <input
              type="date"
              name="PODate"
              className="input-field"
              value={statisticsData.PODate}
              onChange={handleInputChange}
            />
          </div>
          <div className="column">
            <label>Invoice No.</label>
            <input
              type="text"
              name="invoiceNo"
              className="input-field"
              value={statisticsData.invoiceNo}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Row 11: Invoice Date and Purchase Date */}
        <div className="row">
          <div className="column">
            <label>Invoice Date</label>
            <input
              type="date"
              name="invoiceDate"
              className="input-field"
              value={statisticsData.invoiceDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="column">
            <label>Purchase Date</label>
            <input
              type="date"
              name="purchaseDate"
              className="input-field"
              value={statisticsData.purchaseDate}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Row 12: Amount and Remarks */}
        <div className="row">
          <div className="column">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              className="input-field"
              value={statisticsData.amount}
              onChange={handleInputChange}
            />
          </div>
          <div className="column">
            <label>Remarks</label>
            <input
              type="text"
              name="remarks"
              className="input-field"
              value={statisticsData.remarks}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Row 13: Lab No and Permanently Transfer to Lab */}
        <div className="row">
          <div className="column">
            <label>Lab No</label>
            <input
              type="text"
              name="labNo"
              className="input-field"
              value={statisticsData.labNo}
              onChange={handleInputChange}
            />
          </div>
          <div className="column">
            <label>Permanently Transfer to Lab</label>
            <input
              type="text"
              name="permanentlyTransferToLab"
              className="input-field"
              value={statisticsData.permanentlyTransferToLab}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="column">
            <label>Purchase for Lab</label>
            <input
              type="text"
              name="purchaseForLab"
              className="input-field"
              onChange={handleInputChange}
              value={statisticsData.purchaseForLab}
            />
          </div>
        </div>

        <div className="last-row">
          <button type="submit" className="save-btn">
            Save
          </button>
          <button type="button" className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
