import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SidebarMenu from "../../PopUps/Sidebar";

const RequisitionDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const requisition = location.state;

  if (!requisition) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <p className="mb-4">
          No requisition data found. Please go back and select a requisition.
        </p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/RequisitionsRequest")}
        >
          Back to List
        </button>
      </div>
    );
  }

  const { generalDetails, items, approval, Status } = requisition;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="second-home-container h-full flex">
        {/* Sidebar */}
        <div className="sidebar-container">
          <SidebarMenu />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          <div className="bg-white p-4 rounded-md shadow-sm flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">
              Purchase Requisition System
            </h1>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              onClick={() => navigate("/RequisitionsRequest")}
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to List
            </button>
          </div>

          {/* Requisition Header */}
          <div className="bg-white p-6 rounded-md shadow-sm mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  {generalDetails.requisitionNumber}
                </h2>
                <p className="text-sm text-gray-500">
                  Created on{" "}
                  {new Date(generalDetails.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                  {Status}
                </span>
              </div>
            </div>
          </div>

          {/* 3x2 Grid of Requisition Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Box 1: Requester Information */}
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-semibold mb-2">Requester Information</h3>
              <p className="text-sm">
                <span className="font-medium">Name:</span>{" "}
                {generalDetails.requesterName || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span>{" "}
                {generalDetails.requesterEmail || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Phone:</span>{" "}
                {generalDetails.requesterPhone || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-medium">requesterRole:</span>{" "}
                {generalDetails.requesterRole || "N/A"}
              </p>
            </div>

            {/* Box 2: Department & Room Details */}
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-semibold mb-2">Department & Room Details</h3>
              <p className="text-sm">
                <span className="font-medium">Department:</span>{" "}
                {generalDetails.from || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Room No:</span>{" "}
                {generalDetails.roomNo || "N/A"}
              </p>
            </div>

            {/* Box 3: Purchase & Reference Details */}
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-semibold mb-2">Purchase Details</h3>
              <p className="text-sm">
                <span className="font-medium">To:</span>{" "}
                {generalDetails.to || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Reference:</span>{" "}
                {generalDetails.reference || "N/A"}
              </p>
            </div>

            {/* Box 4: Approver Information */}
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-semibold mb-2">Approver Information</h3>
              <p className="text-sm">
                <span className="font-medium">Name:</span>{" "}
                {generalDetails.approverName || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span>{" "}
                {generalDetails.approverEmail || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-medium">approverRole:</span>{" "}
                {generalDetails.approverRole || "N/A"}
              </p>
            </div>

            {/* Box 5: Budget Information */}
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-semibold mb-2">Budget Information</h3>
              <p className="text-sm">
                <span className="font-medium">Sanction Budget:</span>{" "}
                {approval.SanctionBudget || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Amount Spent:</span>{" "}
                {approval.AmountSpent || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Balance Amount:</span>{" "}
                {approval.BalanceAmount || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Approximate Amount:</span>{" "}
                {approval.ApproximateAmount || "N/A"}
              </p>
            </div>

            {/* Box 6: Approval Details */}
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-semibold mb-2">Approval Details</h3>
              <p className="text-sm">
                <span className="font-medium">Additional Notes:</span>{" "}
                {approval.additionalNotes || "N/A"}
              </p>
              {approval.attachment && (
                <p className="text-sm">
                  <span className="font-medium">Attachment:</span>{" "}
                  <a
                    href={approval.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Attachment
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white p-6 rounded-md shadow-sm overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-2 font-semibold text-gray-600">
                    Name
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-600">
                    Quantity
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-600">
                    Unit Price
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-600">
                    Total Price
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-600">
                    Required By
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-600">
                    Priority
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-600">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="px-4 py-2">{item.name || "N/A"}</td>
                    <td className="px-4 py-2">{item.qty || "N/A"}</td>
                    <td className="px-4 py-2">
                      {item.unitPrice ? item.unitPrice.toLocaleString() : "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {item.totalPrice
                        ? item.totalPrice.toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {item.requiredBy
                        ? new Date(item.requiredBy).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.priority === "Low"
                            ? "bg-green-100 text-green-700"
                            : item.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.priority || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-2">{item.remarks || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequisitionDetails;
