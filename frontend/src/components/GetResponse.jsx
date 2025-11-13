// import { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import { ETHGPT_ABI, ETHGPT_ADDRESS,VIT_INFURA_RPC_URL } from "./utils/constants";

// export default function GetResponse({latestId}) {

//     const [response, setResponse] = useState("Waiting for AI response...");

//     useEffect(() => {
//         if(!window.ethereum) return;

//         const provider = new ethers.BrowserProvider(window.ethereum);
//         // const provider = new ethers.WebSocketProvider(VIT_INFURA_RPC_URL);

//         const contract = new ethers.Contract(ETHGPT_ADDRESS,ETHGPT_ABI,provider);

//         const handleAIFulfilled = (id,answer,oracle) => {
//             console.log("🎯 Event triggered:", id.toString(), answer);
//             const eventId = id.toString();
//             if(eventId === latestId){
//                 console.log("✅ Matching ID found. Updating UI...");
//                 setResponse(answer);
//             }else{
//                 console.log("event id mismatched or smt else");
//             }
//         }
//         console.log("latestId is : ",latestId);
//         contract.on("AIFulfilled" , handleAIFulfilled);

//         // suppose user clicks ask 4 times it will give 4 times response of same question or same answer 4 times
//         return () => {
//             contract.off("AIFulfilled" , handleAIFulfilled);
//         }

//     },[latestId]);

//     return (
//         <div>
//       <h3>AI Response:</h3>
//       {response ? (
//         <p>{response}</p>
//       ) : (
//         <p>Waiting for AI response...</p>
//       )}
//     </div>

//     )

// }







import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ETHGPT_ABI, ETHGPT_ADDRESS, VITE_INFURA_WSS_URL, VITE_ALCHEMY_URL } from "../utils/constants";

export default function GetResponse({ latestId }) {
  const [response, setResponse] = useState("Waiting for AI response...");

  useEffect(() => {
    if (!latestId) return;
    console.log("👂 Listening for response to ID:", latestId);

    // 🔌 Use WebSocket provider (Infura)
    const provider = new ethers.WebSocketProvider(VITE_INFURA_WSS_URL);
    // const provider = new ethers.WebSocketProvider(VITE_ALCHEMY_URL);
    const contract = new ethers.Contract(ETHGPT_ADDRESS, ETHGPT_ABI, provider);

    // 🧩 Main event handler
    const handleAIFulfilled = (id, answer, oracle) => {
      console.log("📡 EVENT RECEIVED:", id.toString(), answer);
      if (id.toString() === latestId.toString()) {
        console.log("✅ ID match found! Updating UI...");
        setResponse(answer);

         // Save Q&A to local storage
        const oldHishtory = JSON.parse(localStorage.getItem("history")) || [];
        const newEntry = {
          id: id,
          prompt: localStorage.getItem("lastPrompt") || "Unknown Prompt",
          answer: answer,
          timestamp: new Date().toLocaleString(),
        }
        oldHishtory.unshift(newEntry);
        localStorage.setItem("history",JSON.stringify(oldHishtory.slice(0,10)));


        clearInterval(polling); // stop polling once we get it
      } else {
        console.log("⚠️ Event ID mismatch, ignoring...");
      }
    };

    // 🔄 Fallback polling (check every 7 sec)
    const polling = setInterval(async () => {
      try {
        const req = await contract.getRequest(latestId);
        if (req.response && req.response.length > 0) {
          console.log("✅ Got response via fallback polling!");
          setResponse(req.response);
          clearInterval(polling);
        }
      } catch (err) {
        console.error("polling error:", err);
      }
    }, 7000);

    // 👂 Start listening
    contract.on("AIFulfilled", handleAIFulfilled);

    return () => {
      console.log("🧹 Cleaning up listener...");
      contract.off("AIFulfilled", handleAIFulfilled);
      clearInterval(polling);
      provider.destroy();
    };
  }, [latestId]);

  return (
    <div>
      <h3>AI Response:</h3>
      <p>{response}</p>
    </div>
  );
}
