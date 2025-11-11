// npm install openai
const { ethers } = require("ethers");
const OpenAI = require("openai");
require("dotenv").config({ path: "../.env" });
const contratctJson = require("../artifacts/contracts/EthGPT.sol/EthGPT.json");

const RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY_ORACLE = process.env.PRIVATE_KEY;
const OPENAI_API = process.env.OPENAI_API_KEY;
const CONTRACT_ADDRESS = "0x15Bebaee8eECacD2727200a60dA576a941B96802";

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY_ORACLE, provider);
const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  contratctJson.abi,
  wallet
);
const openai = new OpenAI({ apiKey: OPENAI_API });

console.log("🤖 Oracle is now listening for new AI requests...");

contract.on("AIRequested", async (id, requester, prompt) => {
  try {
    console.log(`\n🧠 New Request ID: ${id}`);
    console.log(`From: ${requester}`);
    console.log(`Prompt: ${prompt}`);

    const chat = await openai.chat.completions.create({
      // model: "gpt-4o-mini",
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });

    const answer = chat.choices[0].message.content;
    console.log("💬 GPT Answer:", answer);


    // //  AI response testing purpose (no OpenAI key needed)
    // const answer = `🤖 Simulated AI Reply: "${prompt}" means blockchain is a decentralized ledger.`;
    // console.log("💬 GPT Answer:", answer);

    const tx = await contract.fulfill(id, answer);
    console.log("📤 Sending transaction:", tx.hash);
    await tx.wait();
    console.log("✅ Fulfill confirmed on blockchain!");
  } catch (error) {
    console.error("the error is", error.message);
  }
});
