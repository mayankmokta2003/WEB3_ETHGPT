import { ethers } from "ethers";
import { useState } from "react";
import { ETHGPT_ADDRESS, ETHGPT_ABI } from "../utils/constants";
import RecentPrompts from "./RecentPrompts";
import { useWallet } from "../utils/wallet";
import GetResponse from "./GetResponse";

// export default function AskAI({ setLatestId }) {
  export default function AskAI() {
  const { accounts, signer } = useWallet();
  const [prompt, setPrompt] = useState("");
  const [txHash, setTxHash] = useState();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [latestId, setLatestId] = useState(null);

  async function sendPrompt() {
    if (!prompt) {
      return alert("PLEASE GIVE PROMPT");
    }
    if (!signer) {
      return alert("PLEASE CONNECT METAMASK");
    }
    try {
      setLoading(true);
      setStatus("⏳ Sending your question to blockchain...");
      localStorage.setItem("lastPrompt", prompt);
      const contract = new ethers.Contract(ETHGPT_ADDRESS, ETHGPT_ABI, signer);
      const tx = await contract.requestAI(prompt);
      setTxHash(tx.hash);
      const receipt = await tx.wait();

      // extract event logs from receipt

      const events = await contract.queryFilter(
        "AIRequested",
        receipt.blockNumber
      );
      const newId = events[0].args.id.toString();
      setLatestId(newId);

      const saved = JSON.parse(localStorage.getItem("prompts")) || [];
      saved.unshift(prompt);
      localStorage.setItem("history", JSON.stringify(saved.slice(0, 5)));
      window.dispatchEvent(new Event("promptsUpdated"));

      setStatus(`✅ Request sent successfully (ID: ${newId})`);
    } catch (e) {
      console.error(e);
      setStatus("❌ Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    // // <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d1117] text-white px-4">
    // <div className="flex flex-col items-center min-h-screen bg-[#0d1117] text-white px-4 py-10 gap-8 mt-10">

    //   <div className="bg-[#161b22] p-8 rounded-2xl shadow-2xl w-full max-w-lg">
    //     <h1 className="text-3xl font-bold mb-2 text-center">🤖 EthGPT</h1>
    //     <p className="text-gray-400 mb-6 text-center">
    //       Ask AI directly on the Ethereum Blockchain
    //     </p>

    //     {accounts && (
    //       <p className="text-sm text-gray-400 mb-2">
    //         Connected: <span className="text-green-400">{accounts}</span>
    //       </p>
    //     )}

    //     <textarea
    //       rows="4"
    //       className="w-full bg-[#0d1117] border border-gray-700 rounded-lg p-3 mb-3 text-white focus:outline-none focus:border-green-500"
    //       value={prompt}
    //       onChange={(e) => setPrompt(e.target.value)}
    //       placeholder="Ask EthGPT anything..."
    //     />

    //     <button
    //       onClick={sendPrompt}
    //       disabled={loading}
    //       className={`w-full py-2 rounded-lg font-semibold transition ${
    //         loading
    //           ? "bg-gray-600 cursor-not-allowed"
    //           : "bg-blue-500 hover:bg-blue-600"
    //       }`}
    //     >
    //       {loading ? "⏳ Sending..." : "🚀 Ask AI"}
    //     </button>

        // {loading && (
        //   <div className="flex justify-center mt-4">
        //     <div className="w-6 h-6 border-4 border-t-transparent border-green-400 rounded-full animate-spin"></div>
        //   </div>
        // )}

        // {status && <p className="text-center text-gray-300 mt-3">{status}</p>}

    //     {txHash && (
    //       <p>
    //         ⛓️ Tx Hash:{" "}
    //         <a
    //           href={`https://sepolia.etherscan.io/tx/${txHash}`}
    //           target="_blank"
    //         >
    //           {txHash.slice(0, 15)}...
    //         </a>
    //       </p>
    //     )}
    //   </div>




      // <div>
      //   <GetResponse latestId={latestId}/>
      // </div>




    //   {signer ? (
    //     <RecentPrompts onSelectPrompt={setPrompt} />
    //   ) : (
    //     <div className="bg-[#161b22] p-5 rounded-2xl shadow-xl w-full max-w-lg ">
    //       <h2 className="text-lg font-semibold mb-3">🕘 Recent Prompts</h2>
    //       <p className="text-gray-400 text-sm">
    //         Connect Metamask first to see latest prompts.
    //       </p>
    //     </div>
    //   )}
    // </div>





    <div className="flex flex-col justify-center items-center gap-10 mt-10">

      <div className="bg-[#161b22] p-8 rounded-2xl shadow-2xl w-200  ">

        
        <h1 className="text-3xl font-bold mb-2 text-center">🤖 EthGPT</h1>
        <p className="text-gray-400 mb-4 text-center">
        Ask AI directly on the Ethereum Blockchain
        </p>

        {accounts && (
          <p className="text-sm text-gray-400 mb-8">
            Connected: <span className="text-green-400">{accounts}</span>
          </p>
         )}

         <textarea 
         rows="4"
         placeholder="ASK ANYTHING"
         value={prompt}
         onChange={(e) => setPrompt(e.target.value)}
         className="w-full bg-[#0d1117] border border-gray-700 rounded-lg p-7 mb-6 text-white focus:outline-none focus:border-green-500"
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

        {txHash && (
          <p>
            ⛓️ Tx Hash:{" "}
            <a target="_blank" href={`https://sepolia.etherscan.io/tx/${txHash}`}>
            {txHash.slice(0,20)}
            </a>
          </p>
        )}
      </div>

      <div>
        <GetResponse latestId={latestId}/>
      </div>




      <div>
      {signer ? (
        <RecentPrompts onSelectPrompt={setPrompt} />
      ) : (
        <div className="bg-[#161b22] p-5 rounded-2xl shadow-xl w-full max-w-lg ">
          <h2 className="text-lg font-semibold mb-3">🕘 Recent Prompts</h2>
          <p className="text-gray-400 text-sm">
            Connect Metamask first to see latest prompts.
          </p>
        </div>
      )}
    </div>


    </div>


  );
}
