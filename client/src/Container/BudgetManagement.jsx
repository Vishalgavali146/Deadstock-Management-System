import React, { useState, useEffect } from "react";
import {
  Save, Briefcase, Building2, Package, PlusCircle, IndianRupee, X, DollarSign,
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

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

  const fetchBudget = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/getBudget`, {
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
    if (!token) { alert("No token provided"); return; }
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/updateBudget`,
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

  useEffect(() => { fetchBudget(); }, []);

  const totalBudget = budget.equipment + budget.furniture + budget.consumables;

  const categoryConfig = [
    { key: "SanctionAmount", label: "Sanctioned Budget", icon: <IndianRupee size={16} color="var(--color-primary)" />, color: "#6366f1" },
    { key: "equipment", label: "Equipment", icon: <Briefcase size={16} color="#0ea5e9" />, color: "#0ea5e9" },
    { key: "furniture", label: "Furniture", icon: <Building2 size={16} color="#10b981" />, color: "#10b981" },
    { key: "consumables", label: "Consumables", icon: <Package size={16} color="#f59e0b" />, color: "#f59e0b" },
  ];

  const utilization = budget.SanctionAmount > 0 ? (totalBudget / budget.SanctionAmount) * 100 : 0;

  return (
    <div className="second-home-container">
      <div className="sidebar-container">
        <SidebarMenu />
      </div>

      <div style={{ flex: 1, minWidth: 0, padding: 28, background: "var(--surface-bg)" }}>
        {/* Page Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <div style={{ width: 40, height: 40, background: "var(--color-primary-bg)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DollarSign size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                Department Budget Allocation
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 1 }}>
                Fiscal Year 2024-25
              </p>
            </div>
          </div>
        </div>

        {/* Utilization Bar */}
        <div style={{ background: "#ffffff", borderRadius: "var(--radius-xl)", border: "1px solid var(--surface-border)", padding: "16px 20px", marginBottom: 20, boxShadow: "var(--shadow-xs)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
              Budget Utilization
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: utilization > 80 ? "var(--color-danger)" : "var(--color-success)" }}>
              {utilization.toFixed(1)}%
            </span>
          </div>
          <div style={{ height: 8, background: "var(--surface-hover)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(utilization, 100)}%`, background: utilization > 80 ? "var(--color-danger)" : "var(--color-primary)", borderRadius: 999, transition: "width 0.5s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Spent: {formatCurrency(totalBudget)}</span>
            <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Sanctioned: {formatCurrency(budget.SanctionAmount)}</span>
          </div>
        </div>

        {/* Two-column grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
          {/* Left: Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ background: "#ffffff", borderRadius: "var(--radius-xl)", border: "1px solid var(--surface-border)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--surface-border)", background: "#f8fafc" }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", margin: 0 }}>
                  Budget Allocation Details
                </h2>
              </div>
              <div style={{ padding: 24 }}>
                {categoryConfig.map(({ key, label, icon, color }) => (
                  <div key={key} style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, background: `${color}14`, borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {icon}
                        </div>
                        <label style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", margin: 0, textTransform: "none", letterSpacing: 0 }}>
                          {label}
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleIncreaseBudget(key)}
                        style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", background: "var(--color-primary-bg)", color: "var(--color-primary)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "var(--radius-md)", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "var(--font-sans)", transition: "all var(--transition-fast)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-primary)"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-primary-bg)"; e.currentTarget.style.color = "var(--color-primary)"; }}
                      >
                        <PlusCircle size={13} /> Increase
                      </button>
                    </div>
                    <input
                      type="number"
                      value={budget[key]}
                      onChange={(e) => setBudget((prev) => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))}
                      style={{
                        width: "100%", height: 44, padding: "0 14px", fontSize: 14, fontFamily: "var(--font-sans)", color: "var(--text-primary)", background: "#f8fafc", border: "1.5px solid var(--surface-border)", borderRadius: "var(--radius-md)", outline: "none", transition: "border-color 150ms ease, box-shadow 150ms ease",
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-primary-bg)"; e.currentTarget.style.background = "#fff"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "var(--surface-border)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "#f8fafc"; }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ padding: "16px 24px", borderTop: "1px solid var(--surface-border)", background: "#f8fafc", display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="save-btn">
                  <Save size={14} /> Update Allocation
                </button>
              </div>
            </div>
          </form>

          {/* Right: Summary */}
          <div style={{ background: "#ffffff", borderRadius: "var(--radius-xl)", border: "1px solid var(--surface-border)", overflow: "hidden", boxShadow: "var(--shadow-sm)", height: "fit-content" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--surface-border)", background: "#f8fafc" }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", margin: 0 }}>Budget Summary</h2>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--surface-border)" }}>
                <p style={{ fontSize: 11.5, color: "var(--text-tertiary)", marginBottom: 4 }}>TOTAL ALLOCATED</p>
                <p style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  {formatCurrency(totalBudget)}
                </p>
              </div>
              {categoryConfig.map(({ key, label, color }) => (
                <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{formatCurrency(budget[key])}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedCategory && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{ background: "#fff", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-xl)", padding: 28, width: 360, position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              style={{ position: "absolute", top: 16, right: 16, background: "var(--surface-hover)", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <X size={14} color="var(--text-secondary)" />
            </button>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>
              Increase Budget
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginBottom: 20 }}>
              Adding to <span style={{ fontWeight: 600, color: "var(--color-primary)" }}>
                {selectedCategory === "SanctionAmount" ? "Sanctioned Budget" : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
              </span>
            </p>
            <input
              type="number"
              value={increaseAmount}
              onChange={(e) => setIncreaseAmount(e.target.value)}
              placeholder="Enter amount to add"
              autoFocus
              style={{ width: "100%", height: 44, padding: "0 14px", fontSize: 14, fontFamily: "var(--font-sans)", color: "var(--text-primary)", background: "#f8fafc", border: "1.5px solid var(--surface-border)", borderRadius: "var(--radius-md)", outline: "none", marginBottom: 20 }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-primary-bg)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--surface-border)"; e.currentTarget.style.boxShadow = "none"; }}
            />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setIsModalOpen(false)} className="cancel-btn">Cancel</button>
              <button onClick={handleSubmitIncrease} className="save-btn">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetManagement;
