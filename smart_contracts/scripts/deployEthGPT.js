// const hre = require("hardhat");
import hre from "hardhat";

async function main() {

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contract with:", deployer.address);
    const oracleAddress = deployer.address;

    const EthGPT = await hre.ethers.getContractFactory("EthGPT");
    const ethgpt = await EthGPT.deploy(oracleAddress);
    await ethgpt.waitForDeployment();
    console.log("✅ EthGPT deployed at: ", await ethgpt.getAddress());
}

main().catch((e) => {
    console.error(e);
    process.exit = 1;
});