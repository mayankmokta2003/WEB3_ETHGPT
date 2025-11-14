import { ethers } from "ethers";
import { useState } from "react";
import { ETHGPT_ADDRESS, ETHGPT_ABI } from "../utils/constants";


export default function AskAI({ setLatestId }) {
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [prompt, setPrompt] = useState("");
  const [txHash,setTxHash] = useState();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        alert("PLEASE INSTALL METAMASK FIRST");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const account = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      setAccount(account[0]);
      setSigner(signer);
    } catch (e) {
      console.error(e);
    }
  }
  


  async function sendPrompt() {
    if(!prompt){
      return alert("PLEASE GIVE PROMPT")
    }
    if(!signer) {
      return alert("PLEASE CONNECT METAMASK");
    }
    try {
      setLoading(true);
      setStatus("⏳ Sending your question to blockchain...");
      localStorage.setItem("lastPrompt",prompt);
      const contract = new ethers.Contract(ETHGPT_ADDRESS, ETHGPT_ABI, signer);
      const tx = await contract.requestAI(prompt);
      setTxHash(tx.hash);
      const receipt = await tx.wait();
  
      // extract event logs from receipt
  
      const events = await contract.queryFilter("AIRequested", receipt.blockNumber);
      const newId = events[0].args.id.toString();
  
      setLatestId(newId);
      setStatus(`✅ Request sent successfully (ID: ${newId})`);
      
  
      // const prev = JSON.parse(localStorage.getItem("prompts")) || [];
      // prev.unshift(prompt);
      // localStorage.setItem("prompts",JSON.stringify(prev.slice(0,5)));
    } catch (e) {
      console.error(e);
      setStatus("❌ Transaction failed. Please try again.");
    }finally{
      setLoading(false);
    }

  }




  return (


    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d1117] text-white px-4">
    <div className="bg-[#161b22] p-8 rounded-2xl shadow-2xl w-full max-w-lg">
      <h1 className="text-3xl font-bold mb-2 text-center">🤖 EthGPT</h1>
      <p className="text-gray-400 mb-6 text-center">
        Ask AI directly on the Ethereum Blockchain
      </p>

      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          🔗 Connect Wallet
        </button>
      ) : (
        <p className="text-sm text-gray-400 mb-2">
          Connected: <span className="text-green-400">{account}</span>
        </p>
      )}

      <textarea
        rows="4"
        className="w-full bg-[#0d1117] border border-gray-700 rounded-lg p-3 mb-3 text-white focus:outline-none focus:border-green-500"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask EthGPT anything..."
      />

      <button
        onClick={sendPrompt}
        disabled={loading}
        className={`w-full py-2 rounded-lg font-semibold transition ${
          loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "⏳ Sending..." : "🚀 Ask AI"}
      </button>

      {loading && (
        <div className="flex justify-center mt-4">
          <div className="w-6 h-6 border-4 border-t-transparent border-green-400 rounded-full animate-spin"></div>
        </div>
      )}

      {status && <p className="text-center text-gray-300 mt-3">{status}</p>}
    </div>
  </div>
);
}
    
      {/* {txHash && (
        <p>
          ⛓️ Tx Hash:{" "}
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
          >
            {txHash.slice(0, 15)}...
          </a>
        </p>
      )} */}

    
