export default function LandingPage({ walletAddress, onConnect, onSponsor, onStudent }) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Georgia', serif" }}>
        {/* Navbar */}
        <nav style={{
          background: "white", padding: "16px 40px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 100
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: "#0d9488", borderRadius: 8, padding: "6px 8px", fontSize: 18 }}>🔗</div>
            <span style={{ fontSize: 20, fontWeight: "bold", color: "#0f172a" }}>GrantChain</span>
          </div>
          <button onClick={onConnect} style={{
            background: walletAddress ? "#0d9488" : "white",
            color: walletAddress ? "white" : "#0f172a",
            border: "2px solid #0d9488", borderRadius: 10,
            padding: "10px 20px", cursor: "pointer", fontWeight: "600", fontSize: 14,
            display: "flex", alignItems: "center", gap: 8
          }}>
            💳 {walletAddress ? `${walletAddress}` : "Connect Wallet"}
          </button>
        </nav>
  
        {/* Hero */}
        <div style={{ textAlign: "center", padding: "80px 40px 60px", maxWidth: 800, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#ccfbf1", color: "#0d9488", padding: "6px 16px",
            borderRadius: 999, fontSize: 13, fontWeight: "600", marginBottom: 32
          }}>
            🔗 Powered by Algorand
          </div>
          <h1 style={{
            fontSize: 56, fontWeight: "bold", color: "#0f172a",
            lineHeight: 1.15, marginBottom: 24
          }}>
            Transparent Grant &<br />Fund Tracking System
          </h1>
          <p style={{ fontSize: 18, color: "#64748b", lineHeight: 1.7, marginBottom: 48 }}>
            Milestone-based funding with full blockchain transparency.<br />
            Sponsors release funds only when milestones are verified and approved.
          </p>
        </div>
  
        {/* Features */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24, maxWidth: 900, margin: "0 auto", padding: "0 40px"
        }}>
          {[
            { icon: "🎯", title: "Milestone-Based", desc: "Funds released incrementally as project goals are met." },
            { icon: "👁️", title: "Full Transparency", desc: "Every transaction recorded and verifiable on-chain." },
            { icon: "🛡️", title: "Secure & Trustless", desc: "Smart contracts ensure fair fund distribution." },
          ].map((f, i) => (
            <div key={i} style={{
              background: "white", borderRadius: 16, padding: 32,
              textAlign: "center", border: "1px solid #e2e8f0"
            }}>
              <div style={{
                background: "#ccfbf1", borderRadius: 999, width: 56, height: 56,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px", fontSize: 24
              }}>{f.icon}</div>
              <h3 style={{ fontWeight: "bold", marginBottom: 8, color: "#0f172a" }}>{f.title}</h3>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
  
        {/* Get Started */}
        <div style={{ padding: "80px 40px", maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 36, fontWeight: "bold", textAlign: "center", marginBottom: 40, color: "#0f172a" }}>
            Get Started
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {[
              { icon: "🛡️", role: "Sponsor", desc: "Create grants, review milestones, and release funds.", action: onSponsor },
              { icon: "🎓", role: "Student Team", desc: "View grants, submit milestones, and track funding.", action: onStudent },
            ].map((r, i) => (
              <div key={i} onClick={r.action} style={{
                background: "white", borderRadius: 16, padding: 36,
                border: "1px solid #e2e8f0", cursor: "pointer",
                transition: "box-shadow 0.2s"
              }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{r.icon}</div>
                <h3 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 8, color: "#0f172a" }}>{r.role}</h3>
                <p style={{ color: "#64748b", marginBottom: 20, lineHeight: 1.6 }}>{r.desc}</p>
                <span style={{ color: "#0d9488", fontWeight: "600", fontSize: 15 }}>Enter Dashboard →</span>
              </div>
            ))}
          </div>
        </div>
  
        <div style={{ textAlign: "center", padding: "24px", color: "#94a3b8", fontSize: 13, borderTop: "1px solid #e2e8f0" }}>
          Built on Algorand · Transparent Grant & Fund Tracking System
        </div>
      </div>
    );
  }