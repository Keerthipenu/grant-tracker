import algosdk from "algosdk";
import { PeraWalletConnect } from "@perawallet/connect";

const algodClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", 443);

export const peraWallet = new PeraWalletConnect({ shouldShowSignTxnToast: true });

export async function connectWallet() {
  try {
    const accounts = await peraWallet.connect();
    return accounts[0];
  } catch (err) {
    console.error("Wallet connect failed:", err);
    return null;
  }
}

export async function disconnectWallet() {
  await peraWallet.disconnect();
}

export async function getBalance(address) {
  try {
    const info = await algodClient.accountInformation(address).do();
    return (Number(info.amount) / 1000000).toFixed(2);
  } catch (err) {
    return "0";
  }
}

export async function sendAlgoPayment(senderAddress, receiverAddress, amountInAlgo, note) {
  const sender = senderAddress || window._walletAddress;
  const receiver = receiverAddress || sender;

  console.log("✅ Sender:", sender);
  console.log("✅ Receiver:", receiver);

  if (!sender || !receiver) {
    console.error("❌ Missing address!");
    return null;
  }

  try {
    const suggestedParams = await algodClient.getTransactionParams().do();

    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: sender,
      to: receiver,
      amount: Math.round(amountInAlgo * 1000000),
      note: new TextEncoder().encode(note),
      suggestedParams,
    });

    console.log("📦 TXN built successfully!");

    const signedTxns = await peraWallet.signTransaction([[{ txn, signers: [sender] }]]);
    const { txId } = await algodClient.sendRawTransaction(signedTxns).do();
    await algosdk.waitForConfirmation(algodClient, txId, 4);

    console.log("✅ TX ID:", txId);
    return txId;

  } catch (err) {
    console.error("❌ Payment failed:", err.message);
    return null;
  }
}

export async function recordOnAlgorand(senderAddress, note) {
  return sendAlgoPayment(senderAddress, senderAddress, 0.001, note);
}