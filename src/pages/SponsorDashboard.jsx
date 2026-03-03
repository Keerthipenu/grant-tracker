import { useState } from "react";
import { sendAlgoPayment } from "../algorand";


export default function SponsorDashboard({ grants, walletAddress, balance, onConnect, onAddGrant, onUpdateGrant, onBack, onRefreshBalance }) {
  const [view, setView] = useState("overview");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGrant, setNewGrant] = useState({ name: "", milestones: [{ title: "", amount: "" }] });

  const totalAllocated = grants.reduce((s, g) => s + Number(g.amount), 0);
  const totalReleased = grants.reduce((s, g) =>
    s + g.milestones.filter(m => m.released).reduce((a, m) => a + Number(m.amount), 0), 0);
  const pendingMilestones = grants.flatMap(g =>
    g.milestones.filter(m => m.submitted && !m.approved).map(m => ({ ...m, grantName: g.name, grantId: g.id }))
  );

  const approveMilestone = async (grantId, milestoneId) => {
    const grant = grants.find(g => g.id === grantId);
    const milestone = grant.milestones.find(m => m.id === milestoneId);

    if (!walletAddress) {
      alert("Please connect your wallet first!");
      return;
    }

    let txId = "ALGO_TX_" + Math.random().toString(36).slice(2, 8).toUpperCase();

    try {
      const note = `GrantChain: Approved "${milestone.title}" for "${grant.name}"`;
      const realTxId = await sendAlgoPayment(walletAddress, walletAddress, 0.001, note);
      if (realTxId) {
        txId = realTxId;
        if (onRefreshBalance) onRefreshBalance();
      }
    } catch (err) {
      console.error("Transaction error:", err);
    }

    const updated = {
      ...grant,
      milestones: grant.milestones.map(m => m.id === milestoneId ? {
        ...m, approved: true, released: true, txId
      } : m)
    };
    onUpdateGrant(updated);
  };

  const rejectMilestone = (grantId, milestoneId) => {
    const grant = grants.find(g => g.id === grantId);
    const updated = {
      ...grant,
      milestones: grant.milestones.map(m => m.id === milestoneId ? { ...m, submitted: false, proof: "" } : m)
    };
    onUpdateGrant(updated);
  };

  const handleCreateGrant = () => {
    if (!newGrant.name) return alert("Enter a project title!");
    onAddGrant({
      id: Date.now(), name: newGrant.name,
      code: "GRT-" + String(grants.length + 1).padStart(3, "0"),
      createdAt: new Date().toISOString().slice(0, 10),
      amount: newGrant.milestones.reduce((s, m) => s + Number(m.amount || 0), 0),
      sponsor: walletAddress || "Sponsor",
      description: "",
      milestones: newGrant.milestones.map((m, i) => ({
        id: i, title: m.title, amount: Number(m.amount || 0),
        description: m.title, approved: false, released: false, submitted: false
      }))
    });
    setShowCreateModal(false);
    setNewGrant({ name: "", milestones: [{ title: "", amount: "" }] });
  };

  const allTxns = grants.flatMap(g =>
    g.milestones.filter(m => m.txId).map(m => ({
      txId: m.txId, from: walletAddress || "ALGO...X7K9",
      to: "ALGO...M3P2", amount: m.amount, status: "Confirmed", grant: g.name
    }))
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', sans-serif", display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: "#0f172a", padding: "24px 0", position: "fixed", top: 0, bottom: 0 }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #1e293b" }}>
          <p style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Sponsor Panel</p>
        </div>
        <div style={{ padding: "16px 0" }}>
          <p style={{ color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, padding: "0 20px 8px" }}>Navigation</p>
          {[
            { id: "overview", label: "Overview", icon: "⊞" },
            { id: "grants", label: "My Grants", icon: "📁" },
            { id: "milestones", label: "Review Milestones", icon: "☑" },
            { id: "transactions", label: "Transactions", icon: "🕐" },
          ].map(item => (
            <div key={item.id} onClick={() => setView(item.id)} style={{
              padding: "10px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
              background: view === item.id ? "#1e293b" : "transparent",
              color: view === item.id ? "#0d9488" : "#94a3b8",
              borderLeft: view === item.id ? "3px solid #0d9488" : "3px solid transparent",
              fontSize: 14
            }}>
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, padding: "0 20px" }}>
          <div onClick={onBack} style={{ color: "#64748b", cursor: "pointer", fontSize: 13 }}>← Back to Home</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft: 220, flex: 1 }}>
        {/* Top bar */}
        <div style={{
          background: "white", padding: "16px 32px", borderBottom: "1px solid #e2e8f0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "sticky", top: 0, zIndex: 50
        }}>
          <span style={{ fontSize: 16, fontWeight: "bold", color: "#0f172a" }}>🔗 Grant Tracker</span>
          <button onClick={onConnect} style={{
            background: walletAddress ? "#ccfbf1" : "#f1f5f9",
            color: walletAddress ? "#0d9488" : "#475569",
            border: "1px solid " + (walletAddress ? "#99f6e4" : "#e2e8f0"),
            borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: "600"
          }}>
            💳 {walletAddress ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-4)} · ◎ ${balance} ALGO` : "Connect Wallet"}
          </button>
        </div>

        <div style={{ padding: 32 }}>
          {/* Overview */}
          {view === "overview" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <div>
                  <h1 style={{ fontSize: 28, fontWeight: "bold", color: "#0f172a", marginBottom: 4 }}>Sponsor Dashboard</h1>
                  <p style={{ color: "#64748b" }}>Manage grants and track fund distribution</p>
                </div>
                <button onClick={() => setShowCreateModal(true)} style={{
                  background: "#0f172a", color: "white", border: "none",
                  borderRadius: 10, padding: "12px 24px", cursor: "pointer", fontWeight: "600", fontSize: 15
                }}>+ Create Grant</button>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
                {[
                  { label: "Total Funds Allocated", value: `$${totalAllocated.toLocaleString()}`, icon: "$", sub: "" },
                  { label: "Funds Released", value: `$${totalReleased.toLocaleString()}`, icon: "↗", sub: `${Math.round((totalReleased / totalAllocated) * 100) || 0}% distributed` },
                  { label: "Pending Reviews", value: pendingMilestones.length, icon: "🕐", sub: "milestones awaiting approval" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <p style={{ color: "#64748b", fontSize: 13, marginBottom: 8 }}>{s.label}</p>
                      <div style={{ background: "#ccfbf1", borderRadius: 8, padding: "6px 8px", fontSize: 16 }}>{s.icon}</div>
                    </div>
                    <p style={{ fontSize: 28, fontWeight: "bold", color: "#0f172a", marginBottom: 4 }}>{s.value}</p>
                    {s.sub && <p style={{ color: "#64748b", fontSize: 12 }}>{s.sub}</p>}
                  </div>
                ))}
              </div>

              {/* Grants with Timeline */}
              <h2 style={{ fontSize: 18, fontWeight: "bold", margin: "0 0 16px", color: "#0f172a" }}>Your Grants</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginBottom: 32 }}>
                {grants.map(g => {
                  const released = g.milestones.filter(m => m.released).reduce((s, m) => s + Number(m.amount), 0);
                  const pct = Math.round((released / g.amount) * 100);
                  return (
                    <div key={g.id} style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #e2e8f0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <h3 style={{ fontWeight: "bold", fontSize: 16, color: "#0f172a" }}>{g.name}</h3>
                        <span style={{ background: "#ccfbf1", color: "#0d9488", padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: "600" }}>Active</span>
                      </div>
                      <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 12 }}>{g.code} · Created {g.createdAt}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ color: "#0d9488", fontWeight: "bold" }}>$ ${released.toLocaleString()} / ${g.amount.toLocaleString()}</span>
                        <span style={{ color: "#64748b", fontSize: 13 }}>{pct}%</span>
                      </div>
                      <div style={{ background: "#f1f5f9", borderRadius: 999, height: 6, marginBottom: 20 }}>
                        <div style={{ width: `${pct}%`, background: "#0d9488", height: 6, borderRadius: 999 }} />
                      </div>
                      {g.milestones.map((m, i) => (
                        <div key={i} style={{ display: "flex", gap: 14, marginBottom: 12, position: "relative" }}>
                          {i < g.milestones.length - 1 && (
                            <div style={{ position: "absolute", left: 13, top: 28, width: 2, height: 24, background: m.approved ? "#0d9488" : "#e2e8f0" }} />
                          )}
                          <div style={{
                            width: 28, height: 28, borderRadius: 999, flexShrink: 0,
                            background: m.approved ? "#0d9488" : m.submitted ? "#f59e0b" : "#e2e8f0",
                            display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, zIndex: 1
                          }}>
                            {m.approved ? "✓" : m.submitted ? "↑" : "🕐"}
                          </div>
                          <div>
                            <p style={{ fontWeight: "600", fontSize: 14, color: "#0f172a" }}>{m.title}</p>
                            <p style={{ color: "#94a3b8", fontSize: 12 }}>${Number(m.amount).toLocaleString()} · {m.approved ? "Approved" : m.submitted ? "Submitted" : "Pending"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>

              {/* Pending Milestones */}
              {pendingMilestones.length > 0 && (
                <div style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0", marginBottom: 32 }}>
                  <h2 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20, color: "#0f172a" }}>Milestone Submissions to Review</h2>
                  {pendingMilestones.map((m, i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "16px 0", borderBottom: i < pendingMilestones.length - 1 ? "1px solid #f1f5f9" : "none"
                    }}>
                      <div>
                        <p style={{ fontWeight: "600", color: "#0f172a", marginBottom: 2 }}>{m.title}</p>
                        <p style={{ color: "#64748b", fontSize: 13 }}>{m.grantName} · ${Number(m.amount).toLocaleString()}</p>
                        {m.proof && <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>"{m.proof}"</p>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <span style={{ background: "#ccfbf1", color: "#0d9488", padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: "600" }}>Submitted</span>
                        <button onClick={() => approveMilestone(m.grantId, m.id)} style={{ background: "none", border: "none", color: "#0d9488", cursor: "pointer", fontWeight: "600", fontSize: 14 }}>✓ Approve</button>
                        <button onClick={() => rejectMilestone(m.grantId, m.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontWeight: "600", fontSize: 14 }}>✕ Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Transaction History */}
              <h2 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16, color: "#0f172a" }}>Transaction History</h2>
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      {["Transaction ID", "From", "To", "Amount", "Status"].map(h => (
                        <th key={h} style={{ padding: "14px 20px", textAlign: "left", color: "#64748b", fontSize: 13, fontWeight: "600", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allTxns.length === 0 ? (
                      <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>No transactions yet.</td></tr>
                    ) : allTxns.map((t, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "14px 20px", fontFamily: "monospace", fontSize: 13, color: "#0f172a" }}>{t.txId}</td>
                        <td style={{ padding: "14px 20px", fontSize: 13, color: "#475569" }}>{walletAddress ? walletAddress.slice(0, 8) + "..." : "ALGO..."}</td>
                        <td style={{ padding: "14px 20px", fontSize: 13, color: "#475569" }}>ALGO...M3P2</td>
                        <td style={{ padding: "14px 20px", fontWeight: "bold", color: "#0f172a" }}>${Number(t.amount).toLocaleString()}</td>
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{ background: "#ccfbf1", color: "#0d9488", padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: "600" }}>Confirmed</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* My Grants */}
          {view === "grants" && (
            <>
              <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24, color: "#0f172a" }}>Your Grants</h1>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
                {grants.map(g => {
                  const released = g.milestones.filter(m => m.released).reduce((s, m) => s + Number(m.amount), 0);
                  const pct = Math.round((released / g.amount) * 100);
                  return (
                    <div key={g.id} style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #e2e8f0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <h3 style={{ fontWeight: "bold", fontSize: 17, color: "#0f172a" }}>{g.name}</h3>
                        <span style={{ background: "#ccfbf1", color: "#0d9488", padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: "600" }}>Active</span>
                      </div>
                      <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 12 }}>{g.code} · Created {g.createdAt}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ color: "#0d9488", fontWeight: "bold" }}>$ ${released.toLocaleString()} / ${g.amount.toLocaleString()}</span>
                        <span style={{ color: "#64748b", fontSize: 13 }}>{pct}%</span>
                      </div>
                      <div style={{ background: "#f1f5f9", borderRadius: 999, height: 6, marginBottom: 16 }}>
                        <div style={{ width: `${pct}%`, background: "#0d9488", height: 6, borderRadius: 999 }} />
                      </div>
                      {g.milestones.map((m, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 999, flexShrink: 0,
                            background: m.approved ? "#0d9488" : m.submitted ? "#f59e0b" : "#e2e8f0",
                            display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13
                          }}>
                            {m.approved ? "✓" : m.submitted ? "↑" : "🕐"}
                          </div>
                          <div>
                            <p style={{ fontWeight: "600", fontSize: 14, color: "#0f172a" }}>{m.title}</p>
                            <p style={{ color: "#94a3b8", fontSize: 12 }}>${Number(m.amount).toLocaleString()} · {m.approved ? "Approved" : m.submitted ? "Submitted" : "Pending"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Transactions */}
          {view === "transactions" && (
            <>
              <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24, color: "#0f172a" }}>Transaction History</h1>
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      {["Transaction ID", "From", "To", "Amount", "Status"].map(h => (
                        <th key={h} style={{ padding: "14px 20px", textAlign: "left", color: "#64748b", fontSize: 13, fontWeight: "600", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allTxns.length === 0 ? (
                      <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>No transactions yet. Approve milestones to see transactions.</td></tr>
                    ) : allTxns.map((t, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "14px 20px", fontFamily: "monospace", fontSize: 13, color: "#0f172a" }}>{t.txId}</td>
                        <td style={{ padding: "14px 20px", fontSize: 13, color: "#475569" }}>{walletAddress ? walletAddress.slice(0, 8) + "..." : "ALGO..."}</td>
                        <td style={{ padding: "14px 20px", fontSize: 13, color: "#475569" }}>ALGO...M3P2</td>
                        <td style={{ padding: "14px 20px", fontWeight: "bold", color: "#0f172a" }}>${Number(t.amount).toLocaleString()}</td>
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{ background: "#ccfbf1", color: "#0d9488", padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: "600" }}>Confirmed</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Review Milestones */}
          {view === "milestones" && (
            <>
              <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24, color: "#0f172a" }}>Review Milestones</h1>
              {pendingMilestones.length === 0 ? (
                <div style={{ background: "white", borderRadius: 14, padding: 60, textAlign: "center", border: "1px solid #e2e8f0" }}>
                  <p style={{ fontSize: 40, marginBottom: 12 }}>✅</p>
                  <p style={{ color: "#64748b" }}>No pending milestones to review!</p>
                </div>
              ) : pendingMilestones.map((m, i) => (
                <div key={i} style={{ background: "white", borderRadius: 14, padding: 24, marginBottom: 16, border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>{m.title}</h3>
                      <p style={{ color: "#64748b", fontSize: 13 }}>{m.grantName} · ${Number(m.amount).toLocaleString()}</p>
                      {m.proof && <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 8, fontStyle: "italic" }}>"{m.proof}"</p>}
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <button onClick={() => approveMilestone(m.grantId, m.id)} style={{
                        background: "#0d9488", color: "white", border: "none",
                        borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: "600"
                      }}>✓ Approve</button>
                      <button onClick={() => rejectMilestone(m.grantId, m.id)} style={{
                        background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca",
                        borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: "600"
                      }}>✕ Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Create Grant Modal */}
      {showCreateModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "white", borderRadius: 20, padding: 36, width: 520, maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: "bold", color: "#0f172a" }}>Create New Grant</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8" }}>✕</button>
            </div>
            <label style={label}>Project Title</label>
            <input placeholder="e.g. Blockchain Research Project" value={newGrant.name}
              onChange={e => setNewGrant({ ...newGrant, name: e.target.value })} style={modalInput} />
            <label style={label}>Milestones</label>
            {newGrant.milestones.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <input placeholder="Milestone name" value={m.title}
                  onChange={e => { const ms = [...newGrant.milestones]; ms[i].title = e.target.value; setNewGrant({ ...newGrant, milestones: ms }); }}
                  style={{ ...modalInput, flex: 2, marginBottom: 0 }} />
                <input placeholder="Amount" type="number" value={m.amount}
                  onChange={e => { const ms = [...newGrant.milestones]; ms[i].amount = e.target.value; setNewGrant({ ...newGrant, milestones: ms }); }}
                  style={{ ...modalInput, flex: 1, marginBottom: 0 }} />
              </div>
            ))}
            <button onClick={() => setNewGrant({ ...newGrant, milestones: [...newGrant.milestones, { title: "", amount: "" }] })} style={{
              background: "none", border: "none", color: "#0d9488", cursor: "pointer", fontWeight: "600", marginBottom: 16
            }}>+ Add</button>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
              <span style={{ color: "#0f172a", fontWeight: "600" }}>Total: ${newGrant.milestones.reduce((s, m) => s + Number(m.amount || 0), 0).toLocaleString()}</span>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowCreateModal(false)} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                <button onClick={handleCreateGrant} style={{ background: "#0f172a", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: "600" }}>Create Grant</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const label = { display: "block", color: "#475569", fontSize: 13, fontWeight: "600", marginBottom: 6 };
const modalInput = {
  width: "100%", border: "2px solid #e2e8f0", borderRadius: 10,
  padding: "12px 14px", fontSize: 14, outline: "none",
  marginBottom: 16, boxSizing: "border-box", color: "#0f172a"
};