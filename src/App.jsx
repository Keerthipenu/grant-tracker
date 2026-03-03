import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import SponsorDashboard from "./pages/SponsorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import { connectWallet, disconnectWallet, peraWallet, getBalance } from "./algorand";

export default function App() {
  const [page, setPage] = useState("landing");
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [grants, setGrants] = useState([
    {
      id: 1, name: "Decentralized Voting System Research", code: "GRT-001",
      createdAt: "2026-01-15", amount: 25000, sponsor: "Tech Foundation",
      description: "Research on decentralized voting using blockchain",
      milestones: [
        { id: 0, title: "Literature Review", amount: 5000, approved: true, released: true, submitted: false, txId: "TXN-8F3A...9D2C" },
        { id: 1, title: "Prototype Development", amount: 5000, approved: true, released: true, submitted: false, txId: "TXN-2B7E...4F1A" },
        { id: 2, title: "Testing & Validation", amount: 8000, approved: false, released: false, submitted: true, proof: "Completed load testing on testnet" },
        { id: 3, title: "Final Report & Documentation", amount: 7000, approved: false, released: false, submitted: false },
      ]
    },
    {
      id: 2, name: "Supply Chain Transparency Tool", code: "GRT-002",
      createdAt: "2026-02-01", amount: 18000, sponsor: "Chain Labs",
      description: "Building transparent supply chain on Algorand",
      milestones: [
        { id: 0, title: "Requirements Analysis", amount: 3000, approved: true, released: true, submitted: false, txId: "TXN-5C1D...8E3B" },
        { id: 1, title: "Smart Contract Design", amount: 3000, approved: true, released: true, submitted: false, txId: "TXN-9A4F...2C7E" },
        { id: 2, title: "Frontend Integration", amount: 6000, approved: false, released: false, submitted: false },
        { id: 3, title: "Deployment & Testing", amount: 6000, approved: false, released: false, submitted: false },
      ]
    },
    {
      id: 3, name: "NFT-Based Academic Credentials", code: "GRT-003",
      createdAt: "2026-02-25", amount: 12000, sponsor: "EduChain",
      description: "Issue academic credentials as NFTs on Algorand",
      milestones: [
        { id: 0, title: "Research Phase", amount: 4000, approved: false, released: false, submitted: true, proof: "Research paper draft completed" },
        { id: 1, title: "Implementation", amount: 4000, approved: false, released: false, submitted: false },
        { id: 2, title: "Final Delivery", amount: 4000, approved: false, released: false, submitted: false },
      ]
    }
  ]);

  useEffect(() => {
    peraWallet.reconnectSession().then(accounts => {
      if (accounts.length) {
        setWalletAddress(accounts[0]);
        getBalance(accounts[0]).then(bal => setBalance(bal));
      }
    }).catch(() => {});
  }, []);

  const handleConnectWallet = async () => {
    if (walletAddress) {
      await disconnectWallet();
      setWalletAddress("");
      setBalance("0");
    } else {
      const address = await connectWallet();
      if (address) {
        setWalletAddress(address);
        const bal = await getBalance(address);
        setBalance(bal);
      }
    }
  };
  const refreshBalance = async () => {
    if (walletAddress) {
      const bal = await getBalance(walletAddress);
      setBalance(bal);
    }
  };
  const addGrant = (grant) => setGrants(prev => [...prev, grant]);
  const updateGrant = (updated) => setGrants(prev => prev.map(g => g.id === updated.id ? updated : g));

  // Store wallet globally so components can always access it
  window._walletAddress = walletAddress;

  return (
    <>
      {page === "landing" && (
        <LandingPage
          walletAddress={walletAddress}
          onConnect={handleConnectWallet}
          onSponsor={() => setPage("sponsor")}
          onStudent={() => setPage("student")}
        />
      )}
      {page === "sponsor" && (
        <SponsorDashboard
        grants={grants}
        walletAddress={walletAddress}
        balance={balance}
        onConnect={handleConnectWallet}
        onAddGrant={addGrant}
        onUpdateGrant={updateGrant}
        onBack={() => setPage("landing")}
        onRefreshBalance={refreshBalance}
      />
      )}
      {page === "student" && (
        <StudentDashboard
          grants={grants}
          walletAddress={walletAddress}
          onConnect={handleConnectWallet}
          onUpdateGrant={updateGrant}
          onBack={() => setPage("landing")}
        />
      )}
    </>
  );
}