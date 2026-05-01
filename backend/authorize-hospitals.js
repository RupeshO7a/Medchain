// authorize-hospitals.js
// Run this after deploying to Sepolia: node authorize-hospitals.js

const { ethers } = require("ethers");
const mongoose = require("mongoose");
require("dotenv").config();

const Hospital = require("./models/Hospital");
const contractData = require("./contractABI.json");

async function authorizeHospitals() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Connect to Sepolia
    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC);
    const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(contractData.address, contractData.abi, wallet);

    const network = await provider.getNetwork();
    console.log("✅ Connected to blockchain:", network.name, "| Chain ID:", network.chainId.toString());
    console.log("📄 Contract:", contractData.address);
    console.log("👤 Admin wallet:", wallet.address);

    const balance = await provider.getBalance(wallet.address);
    console.log("💰 Balance:", ethers.formatEther(balance), "ETH\n");

    if (balance === 0n) {
      console.error("❌ Admin wallet has no ETH! Get test ETH from https://sepoliafaucet.com/");
      process.exit(1);
    }

    // Get all authorized hospitals from DB
    const hospitals = await Hospital.find({ isAuthorized: true }).select("+privateKey");
    console.log(`📋 Found ${hospitals.length} authorized hospital(s) in database\n`);

    if (hospitals.length === 0) {
      console.log("⚠️  No authorized hospitals found in database.");
      console.log("   Go to your admin panel and authorize hospitals first.");
      process.exit(0);
    }

    for (const hospital of hospitals) {
      console.log(`🏥 Hospital: ${hospital.name}`);
      console.log(`   Wallet: ${hospital.walletAddress}`);

      try {
        // Check if already authorized on blockchain
        const isAlreadyAuthorized = await contract.authorizedHospitals(hospital.walletAddress);

        if (isAlreadyAuthorized) {
          console.log(`   ✅ Already authorized on blockchain\n`);
          continue;
        }

        // Authorize on blockchain
        const tx = await contract.authorizeHospital(hospital.walletAddress, hospital.name);
        console.log(`   ⏳ TX sent: ${tx.hash}`);
        console.log(`   🔗 https://sepolia.etherscan.io/tx/${tx.hash}`);

        await tx.wait();
        console.log(`   ✅ Authorized on blockchain!\n`);

      } catch (error) {
        console.log(`   ❌ Error: ${error.message}\n`);
      }
    }

    console.log("🎉 Done! All hospitals authorized.");
    process.exit(0);

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

authorizeHospitals();