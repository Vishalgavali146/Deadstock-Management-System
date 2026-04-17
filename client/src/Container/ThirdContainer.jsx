import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { SecondPageHeaders } from "../data";
import ThirdSB from "../Header/ThirdSB";
import PaginationSP from "../Footer/Pagination";

const ITEMS_PER_PAGE = 5;

export default function ThirdContainer() {
  const { roomNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const rowData = state?.rowData;

  console.log("Received rowData:", rowData);

  const [equipments, setEquipments] = useState(rowData?.eachEquipment || []);

  console.log("Extracted eachEquipment:", equipments);

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(equipments.length / ITEMS_PER_PAGE);
  const currentData = equipments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowClick = (rowvalues) => {
    const dsrNoroute = rowvalues.dsr_no.replace(/\//g, "-");
    navigate(`/${roomNumber}/${dsrNoroute}`, { state: { rowvalues } });
  };

  const handleToggleStatus = async (equipment, e) => {
    e.stopPropagation();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/equipment/toggle/${equipment._id}`
      );

      const updatedEquipment = response.data.equipment;
      setEquipments((prevEquipments) =>
        prevEquipments.map((eq) =>
          eq._id === updatedEquipment._id ? updatedEquipment : eq
        )
      );
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  return (
    <div className="allocated-items-container">
      <div className="p-4" style={{ width: "1170px" }}>
        <div className="min-h-screen bg-gray-100">
          <div className="flex justify-between items-center px-8 py-4 bg-gray-100 border-b border-gray-300 h-full">
            <h1 className="text-xl font-semibold text-gray-800">
              First Term: {roomNumber}
            </h1>
            <ThirdSB />
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <div id="data" className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    {SecondPageHeaders.map((header, index) => (
                      <th key={index} className="px-4 py-2 text-left w-auto">
                        {header}
                      </th>
                    ))}
                    <th className="px-4 py-2 text-left w-auto">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.map((equipment, rowIndex) =>
                    equipment && typeof equipment === "object" ? (
                      <tr
                        key={rowIndex}
                        className="hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleRowClick(equipment)}
                      >
                        {Object.values(equipment)
                          .slice(0, -5)
                          .map((cellData, cellIndex) => (
                            <td key={cellIndex} className="px-4 py-2">
                              {cellData === null || cellData === undefined
                                ? "N/A"
                                : typeof cellData === "object"
                                ? JSON.stringify(cellData)
                                : cellData}
                            </td>
                          ))}
                        <td className="px-4 py-2">
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                            onClick={(e) => handleToggleStatus(equipment, e)}
                          >
                            Toggle Status
                          </button>
                        </td>
                      </tr>
                    ) : null
                  )}
                </tbody>
              </table>
            </div>
            <PaginationSP
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
