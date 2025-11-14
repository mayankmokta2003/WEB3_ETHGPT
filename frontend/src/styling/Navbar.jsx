import { useState } from "react";
import { ethers } from "ethers";
import gpt from "../../images/gpt.png"
import gpt1 from "../../images/gpt1.png"
import gpt2 from "../../images/gpt2.png"
import gpt3 from "../../images/gpt3.png"
import logo from "../../images/logo.png"


export default function Navbar() {
    const [accounts,setAccounts] = useState();

    async function connectWallet() {
        try {
            if(!window.ethereum){
                return alert("PLEASE INSTALL METAMASK FIRST!!");
            }
            const provider = new ethers.BrowserProvider(window.ethereum);
            const account = await ethereum.request({ method: "eth_requestAccounts" });
            setAccounts(account[0]);
            console.log(account);
        } catch (e) {
            console.error(e);
        }
    }


    return(

        <div className="">

            <div className="flex flex-row items-center justify-evenly">

                    <img src={logo} className="h-14 w-40 rounded-2xl"/>
                    <h1>About</h1>
                    <h1>Support</h1>
                    <h1>FAQ</h1>
                    <h1>Language</h1>
                    <h1>Services</h1>
                    <h1 >Library</h1>
                    {/* <div className="bg-amber-600 w-30 rounded-3xl">
                        <h1>Learn more </h1>
                    </div> */}
                    <div>
                        {accounts ? (
                            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition w-46" >
                            🔗 Connected
                          </button>

                        ) : (
                            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition w-46" onClick={connectWallet}>
          🔗 Connect Wallet
        </button>
                        )}
                        
                        </div>
                    
                </div >







                <div className="flex flex-row justify-center items-center mt-20 gap-40">




                    <div>

                        <div>

                        <h1 className="text-5xl">ETHGPT : AI On Blockchain</h1>

                        </div>


                        <div className="space-y-5">
                            <h4 className=" mt-10 text-xl">"Ask Ethereum. Get answers — powered by on-chain AI Oracle.”</h4>
                        <h3 className=" text-xl">"AI meets Ethereum — ask anything on-chain"</h3>
                        

                        <h4 className="text-xl">Built with: Solidity | React | Hardhat | OpenAI</h4>
                        </div>

                        <div className="flex flex-row gap-10 justify-center items-center mt-10">

                           

<div className="bg-amber-600 h-30 w-35 flex flex-col justify-center items-center rounded-xl">
                            
                                <img src={gpt1} className="w-10 rounded-full"/>
                           
                                <p className="text-xs">Real-time AI responses verified on Ethereum Sepolia testnet.</p>
                                
                            </div>

                            <div className="bg-amber-600 h-30 w-35 flex flex-col justify-center items-center rounded-xl">
                            <img src={gpt2} className="w-10 rounded-full"/>
                                <p className="text-xs">Each and every user prompt is stored and processed via smart contracts.</p>
                            </div>

                            <div className="bg-amber-600 h-30  w-35 flex flex-col justify-center items-center rounded-xl">
                            <img src={gpt3} className="w-10 rounded-full"/>
                            
                            <p className="text-xs">Oracle fetches responses off-chain and fulfills them back on-chain.</p>
                                
                            </div>


                        </div>
                        

                    </div>







                    <div>
                    
                        <img src={gpt} className="w-115 rounded-full"/>
                    </div>

                </div>
                
                
            </div>


            
 


    )

}