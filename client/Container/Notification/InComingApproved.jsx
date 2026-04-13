import { useState, useEffect } from "react";
import { tableHeaderswithkeys } from "../../data";
import NotificationSB from "../../Header/NotificationSB";
import Pagination from "../../Footer/Pagination";
import axios from "axios";

const ITEMS_PER_PAGE = 10;

export default function InComingApproved() {
  const [tableData, setTableData] = useState([]);
  const [editedRowData, setEditedRowData] = useState([]);
  const [currentPage, SetcurrentPage] = useState(1);

  const totalPage = Math.ceil(tableData.length / ITEMS_PER_PAGE);

  const curentData = tableData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const HandlePage = (page) => {
    SetcurrentPage(page);
  };

  const handleDelete = (rowIndex) => {
    const updatedData = tableData.filter((_, index) => index !== rowIndex);
    setTableData(updatedData);
  };

  const handleChange = (e, cellIndex) => {
    const newData = [...editedRowData];
    newData[cellIndex] = e.target.value;
    setEditedRowData(newData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await axios.get(
          "http://localhost:5000/ApprovebyRole",
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 15000,
          }
        );
        console.log("API Response:", response.data);
        const approved = response.data.approvedRequests;
        setTableData(approved || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="allocated-items-container ">
      <div style={{ width: "1170px" }}>
        <div className="flex justify-between items-center mb-5 ml-5 mr-5">
          <h1 className="text-2xl font-bold">Approved Items</h1>
          <NotificationSB />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div id="data" className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-800 text-white">
                <tr>
                  {tableHeaderswithkeys.map((headerObj, index) => (
                    <th
                      key={index}
                      className="column-length px-4 py-2 text-left w-48"
                    >
                      {headerObj.label}
                    </th>
                  ))}
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {curentData.map((rowData, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-100">
                    {tableHeaderswithkeys.map((headerObj, cellIndex) => {
                      const value = rowData[headerObj.key];
                      return (
                        <td key={cellIndex} className="px-4 py-2">
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : value}
                        </td>
                      );
                    })}
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(rowIndex)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPage}
            onPageChange={HandlePage}
          />
        </div>
      </div>
    </div>
  );
}
