import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import NotificationSB from "../../Header/NotificationSB";
import Pagination from "../../Footer/Pagination";
import Status from "../../PopUps/Status";
import { tableHeaderswithkeys } from "../../data";

const ITEMS_PER_PAGE = 10;

export default function InComingRequest() {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const toast = useToast();

  const totalPage = Math.ceil(tableData.length / ITEMS_PER_PAGE);
  const currentData = tableData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePage = (page) => {
    setCurrentPage(page);
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/pending-requests",
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 15000,
          }
        );

        console.log("API Response:", response.data);
        setTableData(response.data.pendingRequests || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error Fetching Data",
          description: "Could not load pending requests. Try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    };

    fetchData();
  }, [token, toast]);

  const handleApproval = async (rowData) => {
    try {
      const { dsrNo } = rowData;

      const response = await axios.post(
        `http://localhost:5000/requests/dsr/${encodeURIComponent(
          dsrNo
        )}/RoleApproval`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Approval Response:", response.data);
      toast({
        title: "Request Approved",
        description: `Request for DSR No. ${dsrNo} has been approved.`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });

      setTableData((prev) => prev.filter((req) => req.dsrNo !== dsrNo));
    } catch (error) {
      console.error("Error approving request:", error);
      toast({
        title: "Approval Failed",
        description:
          error.response?.data?.msg ||
          "Something went wrong. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  // Status functionality
  const handleStatusClick = (rowData) => {
    setSelectedStatus(rowData);
    setIsStatusOpen(true);
  };

  const closeStatus = () => {
    setIsStatusOpen(false);
    setSelectedStatus(null);
  };

  return (
    <div className="allocated-items-container">
      <div style={{ width: "1170px" }}>
        <div className="flex justify-between items-center mb-5 ml-5 mr-5">
          <h1 className="text-2xl font-bold">Request Items</h1>
          <NotificationSB />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div id="data" className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-800 text-white">
                <tr>
                  {/* Added Status column */}
                  <th className="px-4 py-2 text-center w-48">Status</th>
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
                {currentData.length > 0 ? (
                  currentData.map((rowData, rowIndex) => (
                    <tr
                      key={rowData._id || rowIndex}
                      className="hover:bg-gray-100"
                    >
                      {/* Status button */}
                      <td className="px-4 py-2 text-center">
                        <button
                          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                          onClick={() => handleStatusClick(rowData)}
                        >
                          Pending
                        </button>
                      </td>
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
                        <div className="flex">
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                            onClick={() => handleApproval(rowData)}
                          >
                            Approve
                          </button>
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={() =>
                              toast({
                                title: "Feature Coming Soon",
                                description:
                                  "Deny functionality will be available soon.",
                                status: "info",
                                duration: 3000,
                                isClosable: true,
                                position: "top-right",
                              })
                            }
                          >
                            Deny
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={tableHeaderswithkeys.length + 2}
                      className="text-center py-4"
                    >
                      No pending requests found.
                    </td>
                  </tr>
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
      {isStatusOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeStatus}
        >
          <div
            className="relative p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Status data={selectedStatus} onClose={closeStatus} />
          </div>
        </div>
      )}
    </div>
  );
}
