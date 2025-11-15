import { ethers } from "ethers";
import { useState,useEffect } from "react";

export default function RecentPrompts({onSelectPrompt}) {
    const [prompts, setPrompts] = useState([]);
    const[accounts,setAccounts] = useState();

    async function connect(){
      const provider = new ethers.BrowserProvider(window.ethereum);
      const account = await provider.send("eth_requestAccounts",[]);
      setAccounts(account[0]);
    }

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("prompts")) || [];
        setPrompts(saved);
    },[]);

    // refresh when a new prompt gets added.
    useEffect(() => {
        const refresh = () => {
        const saved = JSON.parse(localStorage.getItem("prompts")) || [];
        setPrompts(saved);
        }
        window.addEventListener("promptsUpdated",refresh);
    },[]);


    return(
        // <div className="bg-[#161b22] p-5 rounded-2xl shadow-xl w-full max-w-lg mt-8">
        <div className="bg-gradient-to-r from-red-950 to-gray-950 p-5 rounded-2xl shadow-xl w-120 mb-12 border-2 border-orange-900">
      <h2 className="text-lg font-semibold mb-3">🕘 Recent Prompts</h2>
      {prompts.length === 0 ? (
          <p className="text-gray-400 text-sm">No recent prompts yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {prompts.map((p, i) => (
              <button
                key={i}
                onClick={() => onSelectPrompt(p)}
                className="text-left bg-[#0d1117] hover:bg-[#21262d] text-gray-300 rounded-lg px-3 py-2 transition cursor-pointer"
              >
                {p.length > 50 ? p.slice(0, 50) + "......." : p}
              </button>
            ))}
          </div>
        )}
    </div>

    )

}