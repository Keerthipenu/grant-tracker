import { useState } from "react";

const CATEGORIES = ["Equipment", "Software", "Travel", "Marketing", "Research", "Other"];

export default function LogExpense({ grants }) {
  const [selectedGrant, setSelectedGrant] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Equipment");
  const [description, setDescription] = useState("");
  const [expenses, setExpenses] = useState([]);

  const handleLog = () => {
    if (!amount || !description) return alert("Fill in amount and description!");
    const expense = {
      id: Date.now(),
      grantName: selectedGrant || "General",
      amount, category, description,
      date: new Date().toLocaleDateString(),
      txId: "ALGO_TX_" + Math.random().toString(36).slice(2, 10).toUpperCase()
    };
    setExpenses([expense, ...expenses]);
    setAmount(""); setDescription("");
  };

  return (
    <div style={{ padding: 32, maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, fontWeight: "bold", marginBottom: 32 }}>🧾 Log Expense</h1>

      <div style={card}>
        <h2 style={sectionTitle}>Add New Expense</h2>
        <select value={selectedGrant} onChange={e => setSelectedGrant(e.target.value)} style={input}>
          <option value="">Select Grant (optional)</option>
          {grants.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
        </select>
        <input placeholder="Amount in ALGO" type="number" value={amount}
          onChange={e => setAmount(e.target.value)} style={input} />
        <select value={category} onChange={e => setCategory(e.target.value)} style={input}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input placeholder="Description (e.g. Bought laptop for development)" value={description}
          onChange={e => setDescription(e.target.value)} style={input} />
        <button onClick={handleLog} style={primaryBtn}>📝 Log Expense on Algorand</button>
      </div>

      <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>📋 Expense History</h2>
      {expenses.length === 0 ? (
        <div style={{ ...card, textAlign: "center", padding: 40 }}>
          <p style={{ color: "#64748b" }}>No expenses logged yet.</p>
        </div>
      ) : (
        expenses.map(e => (
          <div key={e.id} style={{ ...card, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
                  <span style={{
                    background: "#1d4ed8", color: "white", padding: "2px 10px",
                    borderRadius: 999, fontSize: 12
                  }}>{e.category}</span>
                  {e.grantName && <span style={{ color: "#64748b", fontSize: 12 }}>📋 {e.grantName}</span>}
                </div>
                <p style={{ fontWeight: "bold", marginBottom: 2 }}>{e.description}</p>
                <p style={{ color: "#38bdf8", fontSize: 12, fontFamily: "monospace" }}>TX: {e.txId}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ color: "#4ade80", fontWeight: "bold", fontSize: 18 }}>◎ {e.amount}</p>
                <p style={{ color: "#64748b", fontSize: 12 }}>{e.date}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const card = { background: "#1e293b", borderRadius: 16, padding: 24, marginBottom: 20, border: "1px solid #334155" };
const sectionTitle = { fontSize: 18, fontWeight: "bold", marginBottom: 16 };
const input = {
  width: "100%", background: "#0f172a", border: "1px solid #334155",
  borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", marginBottom: 10,
  fontSize: 14, outline: "none", boxSizing: "border-box"
};
const primaryBtn = {
  width: "100%", background: "#1d4ed8", color: "white", border: "none",
  borderRadius: 12, padding: 14, fontSize: 16, fontWeight: "bold", cursor: "pointer"
};