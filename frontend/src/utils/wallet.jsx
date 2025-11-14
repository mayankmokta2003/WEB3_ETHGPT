import { ethers } from "ethers";
import { useState,useContext,createContext } from "react";


const WalletProvider = createContext();

export function Wallet({ children }) {

    const [accounts,setAccounts] = useState();
    const [signer,setSigner] = useState();


    async function connectWallet() {
        try {
            if(!window.ethereum){
                return alert("PLEASE INSTALL METAMASK!!");
            }
            const provider = new ethers.BrowserProvider(window.ethereum);
            const account = await ethereum.request({ method: "eth_requestAccounts" });
            const sig = await provider.getSigner();
            setAccounts(account[0]);
            setSigner(sig);

        } catch (e) {
            console.error(e);
        }
    }

    return(
        <WalletProvider.Provider value={{ accounts,signer,connectWallet }}>
            {children}
        </WalletProvider.Provider>
    )
} 

export const useWallet = () => useContext(WalletProvider);

