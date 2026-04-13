import React, { useEffect, useState } from "react";
import axios from "axios";

const Status = ({ data, onClose }) => {
  const [statusData, setStatusData] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8080/api/request/status/${data.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStatusData(response.data);
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    if (data?.id) {
      fetchStatus();
    }
  }, [data]);

  const getStatusClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "text-green-700 bg-green-100 border-green-200";
      case "PENDING":
        return "text-yellow-700 bg-yellow-100 border-yellow-200";
      case "DENIED":
        return "text-red-700 bg-red-100 border-red-200";
      case "ABANDONED":
        return "text-gray-700 bg-gray-100 border-gray-200";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 rounded-lg">
      <div className="relative p-6 w-full max-w-2xl bg-white shadow-2xl rounded-lg">
        <h1 className="text-lg font-bold mb-4 text-gray-800 text-center">
          Status Overview
        </h1>
        {statusData ? (
          <>
            <p className="text-center mb-4 font-medium text-gray-700">
              <span className="font-semibold">Request:</span> {statusData.dsrNo}
            </p>
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">
                    Authority
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Lab Incharge", status: statusData.labStatus },
                  { name: "HOD", status: statusData.hodStatus },
                  { name: "Dept DSR IC", status: statusData.deptDsrIcStatus },
                  {
                    name: "Central DSR IC",
                    status: statusData.centralDsrIcStatus,
                  },
                  { name: "Principal", status: statusData.principalStatus },
                ].map((item, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="px-4 py-3 text-gray-800 border-b border-gray-200">
                      {item.name}
                    </td>
                    <td
                      className={`px-4 py-3 font-medium border-b ${getStatusClass(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p className="text-center text-gray-600">Loading status...</p>
        )}
        <div className="mt-4 text-center">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Status;
