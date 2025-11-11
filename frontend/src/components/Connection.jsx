import { ethers } from "ethers";
import { useState } from "react";

export default function Connection() {

    const[account,setAccount] = useState();


    async function connectWallet() {
        try {
            if(!window.ethereum){
                alert("PLEASE INSTALL METAMASK FIRST");
                return;
            }
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const account = await ethereum.request({method: "eth_requestAccounts"});
            setAccount(account[0]);
        } catch (e) {
            console.error(e);
        }
    }


    return(
        <div className="bg-amber-300">

            <button onClick={connectWallet} className="bg-red-600">connect</button>


        </div>
    )
}