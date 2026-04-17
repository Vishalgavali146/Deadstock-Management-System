import React, { useState, useEffect } from "react";
import SidebarMenu from "../PopUps/Sidebar";
import Pagination from "../Footer/Pagination";
import "./Container.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { HistoryCardTable } from "../data";

const ITEMS_PER_PAGE = 5;

const HistoryCard = () => {
  const location = useLocation();
  const { state } = location;
  const rowvalues = state?.rowvalues;

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const initialNewRowState = HistoryCardTable.map(() => "");
  const [newRow, setNewRow] = useState(initialNewRowState);
  const [showNewRow, setShowNewRow] = useState(false);

  const fetchHistory = async () => {
    if (rowvalues && rowvalues._id) {
      try {
        const response = await axios.get(
          `http://localhost:5000/equipment/history/${rowvalues._id}`
        );
        const historyArray = response.data.history.map((item) =>
          HistoryCardTable.map((header) => item[header] || "N/A")
        );
        setData(historyArray);
      } catch (error) {
        console.error("Error fetching history cards", error);
      }
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [rowvalues]);

  const totalPage = Math.ceil(data.length / ITEMS_PER_PAGE);
  const currentData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePage = (page) => {
    setCurrentPage(page);
  };

  const handleNewRowChange = (index, value) => {
    const updatedRow = [...newRow];
    updatedRow[index] = value;
    setNewRow(updatedRow);
  };

  const submitNewRow = async () => {
    const rowObj = HistoryCardTable.reduce((acc, key, idx) => {
      acc[key] = newRow[idx] === "" ? "N/A" : newRow[idx];
      return acc;
    }, {});

    const updatedData = [...data, HistoryCardTable.map((key) => rowObj[key])];
    setData(updatedData);

    try {
      console.log("Submitting payload:", rowObj);
      const response = await axios.post(
        `http://localhost:5000/equipment/history/${rowvalues._id}`,
        rowObj
      );
      console.log("History card added", response.data);
      fetchHistory();
    } catch (error) {
      console.error("Error adding history card", error);
    }

    setNewRow(initialNewRowState);
    setShowNewRow(false);
    setCurrentPage(Math.ceil(updatedData.length / ITEMS_PER_PAGE));
  };

  const cancelNewRow = () => {
    setNewRow(initialNewRowState);
    setShowNewRow(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="second-home-container h-full">
        <div className="sidebar-container">
          <SidebarMenu />
        </div>
        <div className="bg-white border p-7 shadow-md w-[75rem] mx-auto my-5">
          {/* Header Section */}
          <div className="border-b border-gray-500 pb-2 mb-4">
            <h2 className="text-xl font-semibold text-center">
              HISTORY CARD - HARDWARE
            </h2>
            <p className="text-sm text-center">Laboratory Equipment Details</p>
            <p className="text-sm underline text-center">
              V-I characteristics of LED & Detector
            </p>
          </div>
          {/* Supplier and Purchase Details */}
          <div className="grid grid-cols-2 gap-4 border-b border-gray-500 pb-4 mb-4">
            <div className="border-r border-gray-500 pr-4">
              <h3 className="font-semibold underline mb-2">
                Supplier Details:
              </h3>
              <p className="text-sm">{rowvalues?.nameOfSupplier || "N/A"}</p>
              <p className="text-sm">
                50, Swami Vivekanand Soc, Santnagar Pune - 411009
              </p>
              <p className="text-sm">Phone No. 422</p>
            </div>
            <div>
              <h3 className="font-semibold underline mb-2">
                Purchase Details:
              </h3>
              <p className="text-sm">P.O.: PICT/PUR&E/TC/11</p>
              <p className="text-sm">Invoice No.: 82</p>
              <p className="text-sm">Dated: 13/2/12</p>
            </div>
          </div>
          {/* DSR Details */}
          <div className="grid grid-cols-2 gap-4 border-b border-gray-500 pb-4 mb-4">
            <div className="border-r border-gray-500 pr-4">
              <h3 className="font-semibold underline mb-2">DSR Details:</h3>
            </div>
            <div>
              <p className="text-sm">
                Dept. DSR Page No.: {rowvalues?.ddsrPageNo || "N/A"} Sr. No.:{" "}
                {rowvalues?.ddsrSrNo || "N/A"}
              </p>
              <p className="text-sm">DSR No.: {rowvalues?.dsr_no || "N/A"}</p>
            </div>
          </div>
          {/* History Table with Add Row functionality */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold underline">Problem History</h3>
              <button
                onClick={() => setShowNewRow(true)}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Add Row
              </button>
            </div>
            {/* Table container with fixed height */}
            <div style={{ maxHeight: "500px", overflowY: "auto" }}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    {HistoryCardTable.map((header, index) => (
                      <th key={index} className="px-4 py-2 text-left w-auto">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.map((rowData, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-100">
                      {rowData.map((cellData, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-2">
                          {cellData}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {showNewRow && (
                    <>
                      <tr className="bg-gray-100">
                        {HistoryCardTable.map((header, index) => (
                          <td key={index} className="px-4 py-2">
                            <input
                              type="text"
                              className="border rounded px-4 py-2 w-full"
                              value={newRow[index]}
                              onChange={(e) =>
                                handleNewRowChange(index, e.target.value)
                              }
                              placeholder={header}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-gray-100">
                        <td
                          className="px-4 py-2"
                          colSpan={HistoryCardTable.length}
                        >
                          <div className="flex space-x-2 justify-end">
                            <button
                              onClick={submitNewRow}
                              className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                              Submit
                            </button>
                            <button
                              onClick={cancelNewRow}
                              className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPage}
              onPageChange={handlePage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
