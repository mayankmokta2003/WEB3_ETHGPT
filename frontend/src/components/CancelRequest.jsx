import { ethers } from "ethers";
import { useState } from "react";
import { ETHGPT_ADDRESS,ETHGPT_ABI } from "../utils/constants";

export default function CancelRequest() {
    const [cancelId, setCancelId] = useState("");

    async function cancel() {
        if (!cancelId) return alert("Enter request ID to cancel");
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const account = await provider.request({ method: "ethRequestAccounts" });
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ETHGPT_ADDRESS,ETHGPT_ABI,signer);
            const tx = await contract.cancel(cancelId);
            await tx.wait();
            alert(`✅ Request ${cancelId} cancelled successfully`);
            setCancelId("");
            
        } catch (error) {
            console.error(error);
        }
    }

    return(

        <div className="mt-10">
            <h1>Cancel Pending Request</h1>

            <input 
            placeholder="Enter Request ID"
            type="text"
            value={cancelId}
            onChange={(e) => setCancelId(e.target.value)}
            />
            <button onClick={cancel}>Cancel</button>

        </div>



    )

}