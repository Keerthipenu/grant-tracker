export default function GrantDetail({ grant, onUpdate }) {
    const approveMilestone = (i) => {
      const updated = { ...grant, milestones: [...grant.milestones] };
      updated.milestones[i] = {
        ...updated.milestones[i],
        approved: true, released: true,
        txId: "ALGO_TX_" + Math.random().toString(36).slice(2, 10).toUpperCase(),
        releasedAt: new Date().toLocaleString()
      };
      onUpdate(updated);
    };
  
    const totalReleased = grant.milestones
      .filter(m => m.released)
      .reduce((sum, m) => sum + Number(m.amount || 0), 0);
  
    return (
      <div style={{ padding: 32, maxWidth: 800, margin: "0 auto" }}>
        <div style={card}>
          <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 4 }}>{grant.name}</h1>
          {grant.sponsor && <p style={{ color: "#38bdf8", marginBottom: 8 }}>🏢 {grant.sponsor}</p>}
          <p style={{ color: "#94a3b8", marginBottom: 20 }}>{grant.description}</p>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {[
              { label: "TOTAL BUDGET", value: `◎ ${grant.amount} ALGO`, color: "#4ade80" },
              { label: "RELEASED", value: `◎ ${totalReleased} ALGO`, color: "#fb923c" },
              { label: "LOCKED", value: `◎ ${Number(grant.amount) - totalReleased} ALGO`, color: "#a78bfa" },
            ].map((s, i) => (
              <div key={i}>
                <p style={{ color: "#64748b", fontSize: 11 }}>{s.label}</p>
                <p style={{ color: s.color, fontSize: 20, fontWeight: "bold" }}>{s.value}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, background: "#0f172a", borderRadius: 999, height: 10 }}>
            <div style={{
              width: `${(grant.milestones.filter(m => m.approved).length / grant.milestones.length) * 100}%`,
              background: "linear-gradient(90deg, #1d4ed8, #22c55e)", height: 10, borderRadius: 999
            }} />
          </div>
          <p style={{ color: "#64748b", fontSize: 12, marginTop: 6 }}>
            {grant.milestones.filter(m => m.approved).length}/{grant.milestones.length} milestones approved
          </p>
        </div>
  
        <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>📍 Milestones</h2>
        {grant.milestones.map((m, i) => (
          <div key={i} style={{ ...card, border: `1px solid ${m.approved ? "#166534" : "#334155"}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 20 }}>{m.approved ? "✅" : "⏳"}</span>
                  <h3 style={{ fontWeight: "bold" }}>Milestone {i + 1}: {m.title}</h3>
                </div>
                <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 8 }}>{m.description}</p>
                <span style={{ color: "#4ade80", fontWeight: "bold" }}>◎ {m.amount} ALGO</span>
                {m.approved && (
                  <div style={{ marginTop: 10, background: "#0f172a", borderRadius: 8, padding: 10 }}>
                    <p style={{ color: "#22c55e", fontSize: 12 }}>✅ Funds released on Algorand Testnet</p>
                    <p style={{ color: "#38bdf8", fontSize: 12, fontFamily: "monospace" }}>TX: {m.txId}</p>
                    <p style={{ color: "#64748b", fontSize: 11 }}>{m.releasedAt}</p>
                  </div>
                )}
              </div>
              {!m.approved && (
                <button onClick={() => approveMilestone(i)} style={{
                  background: "#166534", color: "#4ade80", border: "1px solid #22c55e",
                  borderRadius: 10, padding: "10px 18px", cursor: "pointer",
                  fontWeight: "bold", marginLeft: 16, whiteSpace: "nowrap"
                }}>✅ Approve & Release</button>
              )}
            </div>
          </div>
        ))}
  
        <h2 style={{ fontSize: 20, fontWeight: "bold", margin: "24px 0 16px" }}>📜 Transaction Log</h2>
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #334155", marginBottom: 8 }}>
            <span style={{ color: "#64748b", fontSize: 12 }}>🔒 Grant Created & Funds Locked</span>
            <span style={{ color: "#38bdf8", fontSize: 12, fontFamily: "monospace" }}>{grant.txId}</span>
          </div>
          {grant.milestones.filter(m => m.released).map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
              <span style={{ color: "#94a3b8", fontSize: 12 }}>💸 Released: {m.title}</span>
              <span style={{ color: "#4ade80", fontSize: 12, fontFamily: "monospace" }}>{m.txId}</span>
            </div>
          ))}
          {grant.milestones.filter(m => m.released).length === 0 && (
            <p style={{ color: "#64748b", fontSize: 13 }}>No funds released yet.</p>
          )}
        </div>
      </div>
    );
  }
  
  const card = { background: "#1e293b", borderRadius: 16, padding: 24, marginBottom: 20, border: "1px solid #334155" };