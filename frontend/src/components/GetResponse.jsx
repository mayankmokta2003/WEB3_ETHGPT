import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ETHGPT_ABI, ETHGPT_ADDRESS } from "./utils/constants";

export default function GetResponse({latestId}) {

    const [response, setResponse] = useState("");

    useEffect(() => {
        if(!window.ethereum) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(ETHGPT_ADDRESS,ETHGPT_ABI,provider);

        const handleAIFulfilled = (id,answer) => {
            const eventId = id.toString();
            if(eventId === latestId){
                setResponse(answer);
            }
        }

        contract.on("AIFulfilled" , handleAIFulfilled);

        // suppose user clicks ask 4 times it will give 4 times response of same question or same answer 4 times
        return () => {
            contract.off("AIFulfilled" , handleAIFulfilled);
        }

    },[latestId]);

    return (
        <div>
      <h3>AI Response:</h3>
      {response ? (
        <p>{response}</p>
      ) : (
        <p>Waiting for AI response...</p>
      )}
    </div>

    )

}