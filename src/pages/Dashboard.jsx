import SpendingChart from "../components/SpendingChart";

export default function Dashboard({ grants, onSelect }) {
  const totalFunded = grants.reduce((sum, g) => sum + Number(g.amount || 0), 0);
  const totalReleased = grants.reduce((sum, g) =>
    sum + g.milestones.filter(m => m.released).reduce((s, m) => s + Number(m.amount || 0), 0), 0);

  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Grants", value: grants.length, color: "#38bdf8", icon: "📋" },
          { label: "Total Funded", value: `◎ ${totalFunded} ALGO`, color: "#4ade80", icon: "💰" },
          { label: "Released", value: `◎ ${totalReleased} ALGO`, color: "#fb923c", icon: "🚀" },
          { label: "Locked", value: `◎ ${totalFunded - totalReleased} ALGO`, color: "#a78bfa", icon: "🔒" },
        ].map((s, i) => (
          <div key={i} style={{
            background: "#1e293b", borderRadius: 14, padding: 20,
            border: "1px solid #334155", textAlign: "center"
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ color: s.color, fontSize: 22, fontWeight: "bold" }}>{s.value}</div>
            <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Grants List */}
        <div>
          <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>📋 Active Grants</h2>
          {grants.length === 0 ? (
            <div style={{
              background: "#1e293b", borderRadius: 16, padding: 48,
              textAlign: "center", border: "2px dashed #334155"
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <p style={{ color: "#64748b" }}>No grants yet. Create your first one!</p>
            </div>
          ) : (
            grants.map(g => (
              <div key={g.id} onClick={() => onSelect(g)} style={{
                background: "#1e293b", borderRadius: 14, padding: 20,
                border: "1px solid #334155", cursor: "pointer", marginBottom: 14
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <h3 style={{ fontWeight: "bold" }}>{g.name}</h3>
                  <span style={{ color: "#4ade80", fontWeight: "bold" }}>◎ {g.amount}</span>
                </div>
                <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>{g.description}</p>
                <div style={{ background: "#0f172a", borderRadius: 999, height: 8 }}>
                  <div style={{
                    width: `${(g.milestones.filter(m => m.approved).length / g.milestones.length) * 100}%`,
                    background: "#22c55e", height: 8, borderRadius: 999
                  }} />
                </div>
                <p style={{ color: "#64748b", fontSize: 12, marginTop: 6 }}>
                  {g.milestones.filter(m => m.approved).length}/{g.milestones.length} milestones done
                </p>
              </div>
            ))
          )}
        </div>

        {/* Chart */}
        <div>
          <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>📊 Spending Overview</h2>
          <SpendingChart grants={grants} />
        </div>
      </div>
    </div>
  );
}