import { useState } from "react";
import algosdk from "algosdk";

export default function CreateGrant({ onSave }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [sponsor, setSponsor] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [milestones, setMilestones] = useState([
    { title: "", amount: "", description: "" }
  ]);

  const addMilestone = () =>
    setMilestones([
      ...milestones,
      { title: "", amount: "", description: "" }
    ]);

  const removeMilestone = (i) =>
    setMilestones(milestones.filter((_, idx) => idx !== i));

  const updateMilestone = (i, field, value) => {
    const updated = [...milestones];
    updated[i][field] = value;
    setMilestones(updated);
  };

  const handleSave = () => {
    const handleSave = () => {
        let trimmedAddress = recipientAddress.trim();

// Remove QR prefixes if present
if (trimmedAddress.startsWith("algorand://")) {
  trimmedAddress = trimmedAddress.replace("algorand://", "");
}

if (trimmedAddress.startsWith("algorand:")) {
  trimmedAddress = trimmedAddress.replace("algorand:", "");
}
      
        // 1️⃣ Basic validations first
        if (!name.trim()) {
          return alert("Please enter a grant name.");
        }
      
        if (!amount || Number(amount) <= 0) {
          return alert("Please enter a valid total amount.");
        }
      
        if (!trimmedAddress) {
          return alert("Please enter the recipient/student wallet address.");
        }
      
        // 2️⃣ Now validate Algorand address
        if (!algosdk.isValidAddress(trimmedAddress)) {
          return alert("Invalid Algorand wallet address! Must be a valid 58-character ALGO address.");
        }
      
        // 3️⃣ Validate milestones
        for (let m of milestones) {
          if (!m.title.trim() || !m.amount || Number(m.amount) <= 0) {
            return alert("Please complete all milestone details correctly.");
          }
        }
  }

    const formattedMilestones = milestones.map((m, i) => ({
      id: i,
      title: m.title.trim(),
      description: m.description.trim(),
      amount: Number(m.amount),
      approved: false,
      released: false,
      submitted: false,
      proof: ""
    }));

    const newGrant = {
      id: Date.now(),
      name: name.trim(),
      description: description.trim(),
      amount: Number(amount),
      sponsor: sponsor.trim(),
      recipientAddress: trimmedAddress, // ✅ Always trimmed
      milestones: formattedMilestones,
      expenses: [],
      createdAt: new Date().toLocaleDateString(),
      txId:
        "ALGO_TX_" +
        Math.random().toString(36).slice(2, 10).toUpperCase()
    };

    onSave(newGrant);

    // ✅ Reset form
    setName("");
    setDescription("");
    setAmount("");
    setSponsor("");
    setRecipientAddress("");
    setMilestones([{ title: "", amount: "", description: "" }]);
  };

  return (
    <div style={{ padding: 32, maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, fontWeight: "bold", marginBottom: 32 }}>
        🆕 Create New Grant
      </h1>

      <div style={card}>
        <h2 style={sectionTitle}>Grant Details</h2>

        <input
          placeholder="Grant Name (e.g. AI Research Project)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
        />

        <input
          placeholder="Sponsor / Organization Name"
          value={sponsor}
          onChange={(e) => setSponsor(e.target.value)}
          style={input}
        />

        <input
          placeholder="Description of the project"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={input}
        />

        <input
          placeholder="Total Amount in ALGO (e.g. 500)"
          type="number"
          step="0.001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={input}
        />

        {/* Recipient Address */}
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: "#0f172a",
            borderRadius: 8,
            border: "1px solid #38bdf8"
          }}
        >
          <label
            style={{
              display: "block",
              color: "#64748b",
              fontSize: 12,
              fontWeight: "600",
              marginBottom: 6,
              textTransform: "uppercase"
            }}
          >
            📍 Recipient Wallet Address
          </label>

          <input
            placeholder="58-character Algorand testnet address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            style={{
              ...input,
              marginBottom: 8,
              fontFamily: "monospace",
              fontSize: 12
            }}
          />

          <p style={{ color: "#94a3b8", fontSize: 11 }}>
            💡 Funds will be sent to this address when milestones are approved.
          </p>
        </div>
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>📍 Milestones</h2>

        {milestones.map((m, i) => (
          <div
            key={i}
            style={{
              background: "#0f172a",
              borderRadius: 12,
              padding: 16,
              marginBottom: 12
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8
              }}
            >
              <p style={{ color: "#38bdf8", fontWeight: "bold" }}>
                Milestone {i + 1}
              </p>

              {milestones.length > 1 && (
                <button
                  onClick={() => removeMilestone(i)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer"
                  }}
                >
                  ✕ Remove
                </button>
              )}
            </div>

            <input
              placeholder="Title"
              value={m.title}
              onChange={(e) =>
                updateMilestone(i, "title", e.target.value)
              }
              style={input}
            />

            <input
              placeholder="ALGO amount"
              type="number"
              step="0.001"
              value={m.amount}
              onChange={(e) =>
                updateMilestone(i, "amount", e.target.value)
              }
              style={input}
            />

            <input
              placeholder="Description"
              value={m.description}
              onChange={(e) =>
                updateMilestone(i, "description", e.target.value)
              }
              style={input}
            />
          </div>
        ))}

        <button onClick={addMilestone} style={secondaryBtn}>
          + Add Another Milestone
        </button>
      </div>

      <button onClick={handleSave} style={primaryBtn}>
        🚀 Create Grant on Algorand
      </button>
    </div>
  );
}

const card = {
  background: "#1e293b",
  borderRadius: 16,
  padding: 24,
  marginBottom: 24,
  border: "1px solid #334155"
};

const sectionTitle = {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 16
};

const input = {
  width: "100%",
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: 8,
  padding: "10px 14px",
  color: "#f1f5f9",
  marginBottom: 10,
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box"
};

const primaryBtn = {
  width: "100%",
  background: "#1d4ed8",
  color: "white",
  border: "none",
  borderRadius: 12,
  padding: 14,
  fontSize: 16,
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: 16
};

const secondaryBtn = {
  background: "#0f172a",
  color: "#38bdf8",
  border: "1px solid #38bdf8",
  borderRadius: 8,
  padding: "8px 16px",
  cursor: "pointer",
  fontSize: 14
};