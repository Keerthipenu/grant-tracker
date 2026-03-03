import { useState } from "react";

export default function StudentDashboard({ grants, walletAddress, onConnect, onUpdateGrant, onBack }) {
  const [view, setView] = useState("overview");
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [proofText, setProofText] = useState("");
  const [submittingMilestone, setSubmittingMilestone] = useState(null);

  const submitMilestone = (grantId, milestoneId) => {
    if (!proofText) return alert("Enter proof of completion!");
    const grant = grants.find(g => g.id === grantId);
    const updated = {
      ...grant,
      milestones: grant.milestones.map(m => m.id === milestoneId ? { ...m, submitted: true, proof: proofText } : m)
    };
    onUpdateGrant(updated);
    setSubmittingMilestone(null);
    setProofText("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', sans-serif", display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: "#0f172a", padding: "24px 0", position: "fixed", top: 0, bottom: 0 }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #1e293b" }}>
          <p style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Student Panel</p>
        </div>
        <div style={{ padding: "16px 0" }}>
          {[
            { id: "overview", label: "Overview", icon: "⊞" },
            { id: "grants", label: "Available Grants", icon: "📋" },
            { id: "mywork", label: "My Submissions", icon: "📤" },
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
          }}>💳 {walletAddress || "Connect Wallet"}</button>
        </div>

        <div style={{ padding: 32 }}>
          {view === "overview" && (
            <>
              <h1 style={{ fontSize: 28, fontWeight: "bold", color: "#0f172a", marginBottom: 4 }}>Student Dashboard</h1>
              <p style={{ color: "#64748b", marginBottom: 28 }}>View grants and submit your milestone completions</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
                {[
                  { label: "Active Grants", value: grants.length, icon: "📋" },
                  { label: "Total Funding Available", value: `$${grants.reduce((s, g) => s + g.amount, 0).toLocaleString()}`, icon: "💰" },
                  { label: "My Submissions", value: grants.flatMap(g => g.milestones.filter(m => m.submitted)).length, icon: "📤" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                    <p style={{ fontSize: 24, fontWeight: "bold", color: "#0f172a" }}>{s.value}</p>
                    <p style={{ color: "#64748b", fontSize: 13 }}>{s.label}</p>
                  </div>
                ))}
              </div>
              <h2 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16, color: "#0f172a" }}>All Grants</h2>
              {grants.map(g => (
                <div key={g.id} onClick={() => { setSelectedGrant(g); setView("detail"); }} style={{
                  background: "white", borderRadius: 14, padding: 20, marginBottom: 14,
                  border: "1px solid #e2e8f0", cursor: "pointer"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <h3 style={{ fontWeight: "bold", color: "#0f172a", marginBottom: 4 }}>{g.name}</h3>
                      <p style={{ color: "#64748b", fontSize: 13 }}>{g.sponsor} · ${g.amount.toLocaleString()} total</p>
                    </div>
                    <span style={{ color: "#0d9488", fontWeight: "600" }}>View →</span>
                  </div>
                </div>
              ))}
            </>
          )}

          {view === "detail" && selectedGrant && (() => {
            const g = grants.find(gr => gr.id === selectedGrant.id);
            const released = g.milestones.filter(m => m.released).reduce((s, m) => s + Number(m.amount), 0);
            return (
              <>
                <button onClick={() => setView("overview")} style={{ background: "none", border: "none", color: "#0d9488", cursor: "pointer", marginBottom: 16, fontWeight: "600" }}>← Back</button>
                <div style={{ background: "white", borderRadius: 16, padding: 28, border: "1px solid #e2e8f0", marginBottom: 24 }}>
                  <h1 style={{ fontSize: 22, fontWeight: "bold", color: "#0f172a", marginBottom: 4 }}>{g.name}</h1>
                  <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 16 }}>{g.code} · Created {g.createdAt}</p>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                    <span style={{ color: "#0d9488", fontWeight: "bold", fontSize: 18 }}>$ ${released.toLocaleString()} / ${g.amount.toLocaleString()}</span>
                    <span style={{ color: "#64748b" }}>{Math.round((released / g.amount) * 100)}%</span>
                  </div>
                  <div style={{ background: "#f1f5f9", borderRadius: 999, height: 8 }}>
                    <div style={{ width: `${Math.round((released / g.amount) * 100)}%`, background: "#0d9488", height: 8, borderRadius: 999 }} />
                  </div>
                </div>

                <h2 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>Milestones</h2>
                {g.milestones.map((m, i) => (
                  <div key={i} style={{ background: "white", borderRadius: 14, padding: 20, marginBottom: 14, border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 999, flexShrink: 0,
                          background: m.approved ? "#0d9488" : m.submitted ? "#f59e0b" : "#e2e8f0",
                          display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14
                        }}>
                          {m.approved ? "✓" : m.submitted ? "↑" : "🕐"}
                        </div>
                        <div>
                          <p style={{ fontWeight: "bold", color: "#0f172a", marginBottom: 2 }}>{m.title}</p>
                          <p style={{ color: "#64748b", fontSize: 13 }}>${Number(m.amount).toLocaleString()} · {m.approved ? "Approved ✅" : m.submitted ? "Submitted — Awaiting Review" : "Pending"}</p>
                          {m.proof && <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 4, fontStyle: "italic" }}>"{m.proof}"</p>}
                          {m.txId && <p style={{ color: "#0d9488", fontSize: 12, fontFamily: "monospace", marginTop: 4 }}>TX: {m.txId}</p>}
                        </div>
                      </div>
                      {!m.approved && !m.submitted && (
                        <button onClick={() => setSubmittingMilestone(m.id)} style={{
                          background: "#0d9488", color: "white", border: "none",
                          borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: "600", fontSize: 13
                        }}>Submit</button>
                      )}
                    </div>
                    {submittingMilestone === m.id && (
                      <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
                        <input placeholder="Describe what you completed..." value={proofText}
                          onChange={e => setProofText(e.target.value)} style={{
                            width: "100%", border: "2px solid #e2e8f0", borderRadius: 8,
                            padding: "10px 14px", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 10
                          }} />
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => submitMilestone(g.id, m.id)} style={{
                            background: "#0d9488", color: "white", border: "none", borderRadius: 8,
                            padding: "8px 16px", cursor: "pointer", fontWeight: "600"
                          }}>Submit Milestone</button>
                          <button onClick={() => setSubmittingMilestone(null)} style={{
                            background: "#f1f5f9", border: "none", borderRadius: 8,
                            padding: "8px 16px", cursor: "pointer"
                          }}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
            );
          })()}

          {view === "grants" && (
            <>
              <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24, color: "#0f172a" }}>Available Grants</h1>
              {grants.map(g => (
                <div key={g.id} style={{ background: "white", borderRadius: 14, padding: 24, marginBottom: 16, border: "1px solid #e2e8f0" }}>
                  <h3 style={{ fontWeight: "bold", fontSize: 17, color: "#0f172a", marginBottom: 4 }}>{g.name}</h3>
                  <p style={{ color: "#64748b", fontSize: 13, marginBottom: 12 }}>{g.sponsor} · ${g.amount.toLocaleString()} total funding</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {g.milestones.map((m, i) => (
                      <span key={i} style={{
                        background: m.approved ? "#ccfbf1" : "#f1f5f9",
                        color: m.approved ? "#0d9488" : "#64748b",
                        padding: "4px 12px", borderRadius: 999, fontSize: 12
                      }}>{m.title}</span>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {view === "mywork" && (
            <>
              <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24, color: "#0f172a" }}>My Submissions</h1>
              {grants.flatMap(g => g.milestones.filter(m => m.submitted).map(m => ({ ...m, grantName: g.name }))).length === 0 ? (
                <div style={{ background: "white", borderRadius: 14, padding: 60, textAlign: "center", border: "1px solid #e2e8f0" }}>
                  <p style={{ fontSize: 40, marginBottom: 12 }}>📤</p>
                  <p style={{ color: "#64748b" }}>No submissions yet. Go to a grant and submit a milestone!</p>
                </div>
              ) : grants.flatMap(g => g.milestones.filter(m => m.submitted).map((m, i) => (
                <div key={i} style={{ background: "white", borderRadius: 14, padding: 20, marginBottom: 14, border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontWeight: "bold", color: "#0f172a" }}>{m.title}</p>
                      <p style={{ color: "#64748b", fontSize: 13 }}>{g.name} · ${Number(m.amount).toLocaleString()}</p>
                      {m.proof && <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>"{m.proof}"</p>}
                    </div>
                    <span style={{
                      background: m.approved ? "#ccfbf1" : "#fef9c3",
                      color: m.approved ? "#0d9488" : "#ca8a04",
                      padding: "4px 14px", borderRadius: 999, fontSize: 12, fontWeight: "600", height: "fit-content"
                    }}>{m.approved ? "Approved ✅" : "Pending Review"}</span>
                  </div>
                </div>
              )))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}