import React, { useState } from "react";
import { connectWallet, sendAlgos, getBalance } from "./algorand";

function GrantRelease() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔁 Replace with your receiver wallet
  const receiverAddress = "PUT_RECEIVER_WALLET_ADDRESS_HERE";

  const handleConnect = async () => {
    const address = await connectWallet();
    setWallet(address);

    const bal = await getBalance(address);
    setBalance(bal);
  };

  const handleRelease = async () => {
    try {
      setLoading(true);

      const txId = await sendAlgos(wallet, receiverAddress, 2);

      alert("Transaction Successful!\nTX ID: " + txId);

      const newBalance = await getBalance(wallet);
      setBalance(newBalance);

    } catch (err) {
      alert("Transaction Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {!wallet ? (
        <button onClick={handleConnect}>Connect Wallet</button>
      ) : (
        <>
          <p><strong>Connected:</strong> {wallet}</p>
          <p><strong>Balance:</strong> {balance} ALGO</p>

          <button onClick={handleRelease} disabled={loading}>
            {loading ? "Processing..." : "Release 2 ALGO"}
          </button>
        </>
      )}
    </div>
  );
}

export default GrantRelease;