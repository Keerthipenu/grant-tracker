import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#38bdf8", "#4ade80", "#fb923c", "#a78bfa", "#f472b6", "#facc15"];

export default function SpendingChart({ grants }) {
  const milestoneData = grants.map(g => ({
    name: g.name.slice(0, 12),
    Budget: Number(g.amount),
    Released: g.milestones.filter(m => m.released).reduce((s, m) => s + Number(m.amount || 0), 0)
  }));

  const pieData = grants.length === 0
    ? [{ name: "No Data", value: 1 }]
    : grants.map(g => ({ name: g.name.slice(0, 12), value: Number(g.amount) }));

  return (
    <div>
      <div style={{ background: "#1e293b", borderRadius: 14, padding: 20, border: "1px solid #334155", marginBottom: 20 }}>
        <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 16 }}>Grant Distribution</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: "#1e293b", border: "none", color: "#f1f5f9" }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: "#1e293b", borderRadius: 14, padding: 20, border: "1px solid #334155" }}>
        <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 16 }}>Budget vs Released</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={milestoneData}>
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={{ background: "#1e293b", border: "none", color: "#f1f5f9" }} />
            <Legend />
            <Bar dataKey="Budget" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Released" fill="#4ade80" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}