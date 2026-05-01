const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: true, credentials: true })); // ✅ Allow all origins for now
app.use(express.json());

// ── Connect Blockchain ──────────────────────────
let contract = null;
let provider = null;

async function connectBlockchain() {
  try {
    provider = new ethers.JsonRpcProvider(
      process.env.BLOCKCHAIN_RPC || "http://127.0.0.1:8545"
    );
    const contractData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "contractABI.json"), "utf8")
    );
    const adminWallet = new ethers.Wallet(
      process.env.ADMIN_PRIVATE_KEY, provider
    );
    contract = new ethers.Contract(
      contractData.address, contractData.abi, adminWallet
    );
    console.log("✅ Connected to blockchain");
    console.log("📋 Contract:", contractData.address);
  } catch (error) {
    console.error("❌ Blockchain connection failed:", error.message);
  }
}

// ── Connect Database ────────────────────────────
async function connectDatabase() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/healthrecords"
    );
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
}

// ── Routes ──────────────────────────────────────
const authRoutes     = require("./routes/auth");
const recordRoutes   = require("./routes/records");
const hospitalRoutes = require("./routes/hospitals");
const adminRoutes    = require("./routes/admin");

app.use((req, res, next) => {
  req.contract = contract;
  req.provider = provider;
  next();
});

app.use("/api/auth",      authRoutes);
app.use("/api/records",   recordRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/admin",     adminRoutes);

// ✅ ROOT ENDPOINT - Added for Railway
app.get("/", (req, res) => {
  res.json({
    message: "MedChain Backend API",
    version: "1.0.0",
    status: "running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "running",
    blockchain: contract ? "connected" : "disconnected",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, req, res, next) => res.status(500).json({ error: "Server error" }));

// ── Start ───────────────────────────────────────
async function startServer() {
  await connectDatabase();
  await connectBlockchain();
  
  // ✅ CRITICAL FIX: Listen on 0.0.0.0 for Railway
  app.listen(PORT, '0.0.0.0', () => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`🌐 Server running on port: ${PORT}`);
    console.log(`📊 Health check: /api/health`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  });
}

startServer();
module.exports = app;