require("dotenv").config({path: "../.env"});
const { ethers } = require("ethers");

const key = process.env.PRIVATE_KEY;
console.log("Your key:", key);
new ethers.Wallet(key);
console.log("✅ Private key is valid!");