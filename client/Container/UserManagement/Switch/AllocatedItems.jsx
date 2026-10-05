import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SecondSB from "../../Header/SecondSB";
import Pagination from "../../Footer/Pagination";
import "./AllocateItems.css";
import { jwtDecode } from "jwt-decode";
import { tableHeaderswithkeys } from "../../data";

const ITEMS_PER_PAGE = 10;

export default function AllocatedItems() {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalPages = Math.ceil(tableData.length / ITEMS_PER_PAGE);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/department/lab/equipments`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000,
        }
      );

      console.log("API Response:", response.data);

      let equipments = [];

      // Check if response contains a labs array (e.g., for HOD)
      if (response.data.labs && Array.isArray(response.data.labs)) {
        response.data.labs.forEach((lab) => {
          if (lab.equipments && Array.isArray(lab.equipments)) {
            lab.equipments.forEach((equipment) => {
              // Add the lab name to each equipment item
              equipments.push({ ...equipment, labName: lab.labName });
            });
          }
        });
      }
      
      else if (
        response.data.equipments &&
        Array.isArray(response.data.equipments)
      ) {
        equipments = response.data.equipments.map((equipment) => ({
          ...equipment,
          labName: response.data.labName || "N/A",
        }));
      } else {
        console.error("Unexpected response format", response.data);
      }

      setTableData(equipments);
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Slice data for pagination
  const currentData = tableData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // When a row is clicked, navigate to details view (adjust as needed)
  const handleRowClick = (rowData) => {
    if (!rowData || typeof rowData !== "object") return;
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    const decodedToken = jwtDecode(token);
    const labId = decodedToken.LabId;
    navigate(`/${labId}`, { state: { rowData } });
  };

  return (
    <div className="allocated-items-container">
      <div style={{ width: "1170px" }}>
        <div className="flex justify-between items-center mb-5 ml-5 mr-5">
          <h1 className="text-2xl font-bold">Allocated Items</h1>
          <SecondSB />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div id="data" className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    {tableHeaderswithkeys.map((header, index) => (
                      <th key={index} className="px-4 py-2 text-left">
                        {header.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.map((rowData, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleRowClick(rowData)}
                    >
                      {tableHeaderswithkeys.map((header, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-2">
                          {rowData[header.key] !== undefined &&
                          rowData[header.key] !== null
                            ? typeof rowData[header.key] === "object"
                              ? JSON.stringify(rowData[header.key])
                              : rowData[header.key]
                            : "N/A"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
