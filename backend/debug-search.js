// debug-search.js
// Run this in your backend folder: node debug-search.js
// This will tell you EXACTLY why search is failing

const { ethers } = require("ethers");
const crypto = require("crypto");
require("dotenv").config();

const contractData = require("./contractABI.json");

function hashPatientId(aadhaar) {
  return crypto.createHash("sha256")
    .update(aadhaar + "medchain-india-health-records-privacy-salt")
    .digest("hex");
}

async function debug() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔍 MedChain Search Debugger");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Step 1: Check env variables
  console.log("📋 STEP 1: Environment Variables");
  console.log("   BLOCKCHAIN_RPC:", process.env.BLOCKCHAIN_RPC || "❌ NOT SET");
  console.log("   Contract Address:", contractData.address);
  console.log("   ADMIN_PRIVATE_KEY:", process.env.ADMIN_PRIVATE_KEY ? "✅ SET" : "❌ NOT SET");
  console.log();

  // Step 2: Connect to blockchain
  console.log("📋 STEP 2: Connecting to Blockchain...");
  let provider;
  try {
    provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC);
    const network = await provider.getNetwork();
    console.log("   ✅ Connected! Network:", network.name, "| Chain ID:", network.chainId.toString());
  } catch (err) {
    console.log("   ❌ FAILED to connect:", err.message);
    console.log("   → Check your BLOCKCHAIN_RPC in .env");
    return;
  }
  console.log();

  // Step 3: Check contract exists at address
  console.log("📋 STEP 3: Checking Contract at", contractData.address);
  try {
    const code = await provider.getCode(contractData.address);
    if (code === "0x") {
      console.log("   ❌ NO CONTRACT at this address on this network!");
      console.log("   → Your contract was deployed to a DIFFERENT network");
      console.log("   → You need to redeploy to match your BLOCKCHAIN_RPC network");
    } else {
      console.log("   ✅ Contract exists! Code length:", code.length);
    }
  } catch (err) {
    console.log("   ❌ Error:", err.message);
  }
  console.log();

  // Step 4: Check total records on contract
  console.log("📋 STEP 4: Checking Total Records on Contract");
  try {
    const contract = new ethers.Contract(contractData.address, contractData.abi, provider);
    const total = await contract.totalRecords();
    console.log("   Total records on blockchain:", total.toString());
    if (total.toString() === "0") {
      console.log("   ⚠️  ZERO records! Data was NOT saved to this contract");
      console.log("   → seed.js saved data to a DIFFERENT contract or network");
    }
  } catch (err) {
    console.log("   ❌ Error calling totalRecords:", err.message);
  }
  console.log();

  // Step 5: Check admin wallet authorization
  console.log("📋 STEP 5: Checking Admin Wallet");
  if (process.env.ADMIN_PRIVATE_KEY) {
    try {
      const adminWallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY);
      console.log("   Admin address:", adminWallet.address);
      const contract = new ethers.Contract(contractData.address, contractData.abi, provider);
      const govAdmin = await contract.governmentAdmin();
      console.log("   Contract governmentAdmin:", govAdmin);
      console.log("   Match:", adminWallet.address.toLowerCase() === govAdmin.toLowerCase() ? "✅ YES" : "❌ NO - different wallet deployed contract");
    } catch (err) {
      console.log("   ❌ Error:", err.message);
    }
  }
  console.log();

  // Step 6: Try searching for a seeded Aadhaar
  console.log("📋 STEP 6: Trying to Search Aadhaar 777777777771");
  const testAadhaar = "777777777771";
  const hash = hashPatientId(testAadhaar);
  console.log("   Aadhaar:", testAadhaar);
  console.log("   Hash:", hash.substring(0, 20) + "...");

  try {
    // Try with plain provider first
    const contract = new ethers.Contract(contractData.address, contractData.abi, provider);
    const records = await contract.getPatientRecords(hash);
    console.log("   ✅ Search worked! Records found:", records.length);
    if (records.length > 0) {
      console.log("   First record hospital:", records[0].hospitalName);
    }
  } catch (err) {
    console.log("   ❌ Search FAILED with plain provider:", err.message);

    // Try with admin wallet
    if (process.env.ADMIN_PRIVATE_KEY) {
      try {
        console.log("   Trying with admin wallet...");
        const adminWallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
        const contract = new ethers.Contract(contractData.address, contractData.abi, adminWallet);
        const records = await contract.getPatientRecords(hash);
        console.log("   ✅ Works with admin wallet! Records:", records.length);
        console.log("   → Your contract requires msg.sender to be authorized for search");
        console.log("   → Apply the records.js fix I provided");
      } catch (err2) {
        console.log("   ❌ Also failed with admin wallet:", err2.message);
      }
    }
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Share the output above to diagnose the issue!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

debug().catch(console.error);