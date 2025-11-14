import { getWebSocketProvider } from "../utils/provider";
import { ethers } from "ethers";
import { ETHGPT_ABI, ETHGPT_ADDRESS } from "../utils/constants";
import { useState, useEffect } from "react";

export default function GetResponse({ latestId }) {
  const [response, setResponse] = useState("Waiting for AI response...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const provider = getWebSocketProvider();
    const contract = new ethers.Contract(ETHGPT_ADDRESS, ETHGPT_ABI, provider);

    const handleAIFulfilled = (id, answer, oracle) => {
      const eventId = id.toString();
      console.log("🎯 Event triggered:", eventId, answer);
      if (eventId === latestId) {
        console.log("✅ Matching ID found. Updating UI...");
        setResponse(answer);
        setLoading(false);

        const stored = localStorage.getItem("history");
        let oldHistory = [];

        try {
          // const stored = localStorage.getItem("history");
          // let oldHistory = [];
          oldHistory = stored ? JSON.parse(stored) : [];
        } catch (e) {
          console.error("⚠️ Corrupted history JSON, resetting...");
          oldHistory = [];
        }

        const newEntry = {
          id: id.toString(),
          prompt: localStorage.getItem("lastPrompt") || "Unknown Prompt",
          answer,
          timestamp: new Date().toLocaleString(),
        };

        // Add new entry to the beginning
        oldHistory.unshift(newEntry);

        // Keep only latest 10
        localStorage.setItem(
          "history",
          JSON.stringify(oldHistory.slice(0, 10))
        );
        window.dispatchEvent(new Event("historyUpdated"));
        console.log("🧾 History updated:", newEntry);
      }
    };

    console.log("latestId is:", latestId);
    contract.on("AIFulfilled", handleAIFulfilled);
    setLoading(true);

    return () => {
      console.log("🧹 Cleaning up WebSocket listener...");
      contract.off("AIFulfilled", handleAIFulfilled);
    };
  }, [latestId]);

  return (
    <div className="flex flex-col items-center justify-center text-white mt-6">
      <div className="bg-[#161b22] p-6 rounded-2xl shadow-xl w-full max-w-lg text-center">
        <h2 className="text-2xl font-semibold mb-3">🧠 AI Response</h2>

        {loading ? (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-t-transparent border-green-400 rounded-full animate-spin mb-3"></div>
            <p className="text-gray-400">Waiting for AI response...</p>
          </div>
        ) : (
          <p className="text-green-400 whitespace-pre-line">{response}</p>
        )}
      </div>
    </div>
  );
}
