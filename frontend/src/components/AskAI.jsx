import { ethers } from "ethers";
import { useState } from "react";
import { ETHGPT_ADDRESS, ETHGPT_ABI } from "./utils/constants";

export default function Connection({setLatestId}) {
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [prompt, setPrompt] = useState("");
  const [txHash,setTxHash] = useState();
  const [latestId, setLatestId] = useState();

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        alert("PLEASE INSTALL METAMASK FIRST");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await provider.send("eth_requestAccounts", []);
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
    const contract = new ethers.Contract(ETHGPT_ADDRESS, ETHGPT_ABI, signer);
    const tx = await contract.requestAI(prompt);
    setTxHash(tx.hash);
    const receipt = await tx.wait();

    // extract event logs from receipt

    const event = receipt.logs
    .map((log) => {
      try{
        // makes event readable
        return contract.interface.parseLog(log);
      }catch(e){
        console.error(e);
      }
    }).filter((e) => e && e.name === "AIRequested")[0];

    if(event){
      const newId = event.args.id.toString();
      console.log("New Request ID:", newId);
      setLatestId(newId);
    }else{
      console.log("Could not parse event from receipt");
    }
  }

  

 



  return (
    <div style={{ textAlign: "center", padding: "30px" }}>
      <h1>🤖 EthGPT</h1>
      <p>AI on the Ethereum Blockchain</p>

      {!account ? (
        <button onClick={connectWallet}>🔗 Connect Wallet</button>
      ) : (
        <p>Connected: {account}</p>
      )}

      <textarea
        rows="3"
        cols="50"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask EthGPT anything..."
      />
      <br />
      <button onClick={sendPrompt}>🚀 Ask AI</button>
      

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

    </div>
  );
}
