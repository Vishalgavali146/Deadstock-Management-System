import React, { useState, useEffect } from "react";
import {
  Save,
  Briefcase,
  Building2,
  Package,
  PlusCircle,
  IndianRupee,
} from "lucide-react";

import SidebarMenu from "../PopUps/Sidebar";
import "./Container.css";
import axios from "axios";

function BudgetManagement() {
  const [budget, setBudget] = useState({
    equipment: 0,
    furniture: 0,
    consumables: 0,
    SanctionAmount: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [increaseAmount, setIncreaseAmount] = useState("");

  const handleIncreaseBudget = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleSubmitIncrease = () => {
    if (!increaseAmount || isNaN(increaseAmount)) {
      alert("Please enter a valid number");
      return;
    }
    setBudget((prev) => ({
      ...prev,
      [selectedCategory]: prev[selectedCategory] + parseFloat(increaseAmount),
    }));
    setIsModalOpen(false);
    setIncreaseAmount("");
    setSelectedCategory(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const fetchBudget = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token provided");
      return;
    }
    try {
      const response = await axios.get("http://localhost:5000/getBudget", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedBudget = response.data.msg || {};
      setBudget({
        equipment: fetchedBudget.equipment ?? 0,
        furniture: fetchedBudget.furniture ?? 0,
        consumables: fetchedBudget.consumables ?? 0,
        SanctionAmount: fetchedBudget.SanctionAmount ?? 0,
      });
    } catch (err) {
      console.log("Error Occurred", err);
    }
  };

  const updateBudget = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token provided");
      return;
    }
    try {
      const response = await axios.put(
        "http://localhost:5000/updateBudget",
        budget,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Budget updated:", response.data);
      alert("Budget updated successfully.");
    } catch (err) {
      console.log("Error updating budget:", err);
      alert("Error updating budget.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBudget();
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  // Total allocation excludes SanctionAmount
  const totalBudget = budget.equipment + budget.furniture + budget.consumables;

  // List all budget categories including Sanctioned Budget for the form display
  const categories = [
    "SanctionAmount",
    "equipment",
    "furniture",
    "consumables",
  ];

  return (
    <div className="second-home-container">
      <div className="sidebar-content">
        <SidebarMenu />
      </div>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-5">
            <div className="flex items-center space-x-4 mb-4">
              <Building2 className="h-8 w-8 text-slate-700" />
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  Department Budget Allocation
                </h1>
                <p className="text-sm text-slate-600">Fiscal Year 2024-25</p>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-slate-200 to-transparent" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                  <h2 className="text-lg font-medium text-slate-900 mb-6">
                    Budget Allocation Details
                  </h2>
                  {categories.map((category, index) => {
                    let icon;
                    let label;
                    if (category === "equipment") {
                      icon = <Briefcase className="h-5 w-5 text-slate-700" />;
                      label = "Equipment";
                    } else if (category === "furniture") {
                      icon = <Building2 className="h-5 w-5 text-slate-700" />;
                      label = "Furniture";
                    } else if (category === "consumables") {
                      icon = <Package className="h-5 w-5 text-slate-700" />;
                      label = "Consumables";
                    } else if (category === "SanctionAmount") {
                      icon = <IndianRupee className="h-5 w-5 text-slate-700" />;
                      label = "Sanctioned Budget";
                    }

                    return (
                      <div key={index} className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-slate-100 rounded-md">
                              {icon}
                            </div>
                            <label className="text-sm font-medium text-slate-900">
                              {label}
                            </label>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleIncreaseBudget(category)}
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <PlusCircle className="h-5 w-5 mr-1" />
                            Increase Budget
                          </button>
                        </div>
                        <input
                          type="number"
                          value={budget[category]}
                          onChange={(e) =>
                            setBudget((prev) => ({
                              ...prev,
                              [category]: parseFloat(e.target.value),
                            }))
                          }
                          className="w-full px-4 py-3 text-slate-900 border border-slate-200 rounded-lg"
                        />
                      </div>
                    );
                  })}

                  <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                    >
                      <Save className="h-4 w-4 inline mr-2" /> Update Allocation
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-medium text-slate-900 mb-6">
                  Budget Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600">Amount Spent</span>
                    <span className="text-lg font-semibold text-slate-900">
                      {formatCurrency(totalBudget)}
                    </span>
                  </div>
                  {categories.map((category, index) => {
                    let label;
                    if (category === "equipment") {
                      label = "Equipment";
                    } else if (category === "furniture") {
                      label = "Furniture";
                    } else if (category === "consumables") {
                      label = "Consumables";
                    } else if (category === "SanctionAmount") {
                      label = "Sanctioned Budget";
                    }
                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-slate-600">{label}</span>
                        <span className="font-medium text-slate-900">
                          {formatCurrency(budget[category])}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-medium text-slate-900 mb-4">
              Increase Budget for{" "}
              {selectedCategory === "SanctionAmount"
                ? "Sanctioned Budget"
                : selectedCategory.charAt(0).toUpperCase() +
                  selectedCategory.slice(1)}
            </h2>
            <input
              type="number"
              value={increaseAmount}
              onChange={(e) => setIncreaseAmount(e.target.value)}
              className="w-full px-4 py-3 text-slate-900 border border-slate-200 rounded-lg mb-4"
              placeholder="Enter amount to add"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitIncrease}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetManagement;
