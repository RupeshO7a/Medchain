const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚀 Deploying HealthRecords Contract to Sepolia...");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Get deployer wallet
  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deploying with account:", deployer.address);

  // Check ETH balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  if (balance === 0n) {
    console.error("❌ Error: Account has no ETH!");
    console.log("👉 Get free Sepolia ETH from:");
    console.log("   https://sepoliafaucet.com/");
    process.exit(1);
  }

  // Get contract factory
  const HealthRecords = await hre.ethers.getContractFactory("HealthRecords");

  console.log("⏳ Deploying contract...");

  // Deploy contract to blockchain
  const healthRecords = await HealthRecords.deploy();

  // Wait until deployment is mined
  await healthRecords.waitForDeployment();

  // Get deployed contract address
  const contractAddress = await healthRecords.getAddress();

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ Contract deployed successfully!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📄 Contract Address:", contractAddress);
  console.log("🔗 View on Etherscan:");
  console.log(`   https://sepolia.etherscan.io/address/${contractAddress}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Save contract ABI + address
  const contractData = {
    address: contractAddress,
    abi: JSON.parse(HealthRecords.interface.formatJson())
  };

  // Path to backend folder
  const backendPath = path.join(__dirname, "../../backend/contractABI.json");

  // Write ABI file
  fs.writeFileSync(
    backendPath,
    JSON.stringify(contractData, null, 2)
  );

  console.log("💾 Contract ABI saved to:");
  console.log("   ", backendPath);

  console.log("\n⚠️ IMPORTANT:");
  console.log("Add this to Railway environment variables:");
  console.log(`CONTRACT_ADDRESS=${contractAddress}`);

  console.log("\n🎉 Deployment complete!\n");
}

// Execute script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });