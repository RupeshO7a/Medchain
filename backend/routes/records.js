const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { ethers } = require("ethers");
const Hospital = require("../models/Hospital");
const { protect } = require("../middleware/auth");

function hashPatientId(aadhaar) {
  return crypto.createHash("sha256")
    .update(aadhaar + "medchain-india-health-records-privacy-salt")
    .digest("hex");
}

router.post("/add", protect, async (req, res) => {
  try {
    const { aadhaarNumber, doctorName, diagnosis, medicines, testResults, notes } = req.body;
    if (!aadhaarNumber || !doctorName || !diagnosis)
      return res.status(400).json({ error: "Missing required fields" });
    if (aadhaarNumber.length !== 12 || !/^\d{12}$/.test(aadhaarNumber))
      return res.status(400).json({ error: "Aadhaar must be exactly 12 digits" });

    const hospital = await Hospital.findById(req.hospital.id).select("+privateKey");
    if (!hospital) return res.status(404).json({ error: "Hospital not found" });
    if (!hospital.isAuthorized) return res.status(403).json({ error: "Hospital not authorized" });

    const patientId = hashPatientId(aadhaarNumber);
    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC);
    const wallet = new ethers.Wallet(hospital.privateKey, provider);
    const contractData = require("../contractABI.json");
    const contract = new ethers.Contract(contractData.address, contractData.abi, wallet);

    const tx = await contract.addRecord(patientId, doctorName, diagnosis, medicines || "", testResults || "", notes || "");
    const receipt = await tx.wait();
    hospital.totalRecordsAdded += 1;
    await hospital.save();

    res.json({ success: true, message: "Record added to blockchain", transactionHash: receipt.hash, blockNumber: receipt.blockNumber, patientId: patientId.substring(0, 10) + "..." });
  } catch (error) {
    console.error("Add record error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to add record" });
  }
});

router.post("/search", protect, async (req, res) => {
  try {
    const { aadhaarNumber } = req.body;
    if (!aadhaarNumber) return res.status(400).json({ success: false, error: "Aadhaar number is required" });

    const cleanAadhaar = aadhaarNumber.replace(/[\s-]/g, '');
    if (cleanAadhaar.length !== 12 || !/^\d{12}$/.test(cleanAadhaar))
      return res.status(400).json({ success: false, error: "Aadhaar must be exactly 12 digits" });

    const patientId = hashPatientId(cleanAadhaar);
    console.log(`🔍 [${req.hospital.name}] Searching: ${cleanAadhaar} → ${patientId.substring(0, 16)}...`);

    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC);
    const contractData = require("../contractABI.json");
    const contract = new ethers.Contract(contractData.address, contractData.abi, provider);

    const records = await contract.getPatientRecords(patientId);
    console.log(`✅ Found ${records.length} records`);

    const formatted = records.map(record => ({
      recordId: Number(record.recordId),
      patientId: record.patientId,
      hospitalName: record.hospitalName,
      doctorName: record.doctorName,
      diagnosis: record.diagnosis,
      medicines: record.medicines,
      testResults: record.testResults,
      notes: record.notes,
      visitDate: Number(record.visitDate),
      visitDateFormatted: new Date(Number(record.visitDate) * 1000).toLocaleString()
    }));

    res.json({ success: true, total: formatted.length, records: formatted, message: formatted.length === 0 ? "No records found" : `Found ${formatted.length} record(s)` });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to search records" });
  }
});

router.get("/:aadhaar", protect, async (req, res) => {
  try {
    const cleanAadhaar = req.params.aadhaar.replace(/[\s-]/g, '');
    if (cleanAadhaar.length !== 12 || !/^\d{12}$/.test(cleanAadhaar))
      return res.status(400).json({ success: false, error: "Aadhaar must be exactly 12 digits" });

    const patientId = hashPatientId(cleanAadhaar);
    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC);
    const contractData = require("../contractABI.json");
    const contract = new ethers.Contract(contractData.address, contractData.abi, provider);
    const records = await contract.getPatientRecords(patientId);

    const formatted = records.map(record => ({
      recordId: Number(record.recordId), patientId: record.patientId, hospitalName: record.hospitalName,
      doctorName: record.doctorName, diagnosis: record.diagnosis, medicines: record.medicines,
      testResults: record.testResults, notes: record.notes, visitDate: Number(record.visitDate),
      visitDateFormatted: new Date(Number(record.visitDate) * 1000).toLocaleString()
    }));

    res.json({ success: true, records: formatted, total: formatted.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/records/stats - Dashboard stats for logged-in hospital
router.get("/stats", protect, async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.hospital.id);
    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC);
    const contractData = require("../contractABI.json");
    const contract = new ethers.Contract(contractData.address, contractData.abi, provider);

    const totalOnChain = Number(await contract.totalRecords());

    // Today's records = records added today by this hospital (from totalRecordsAdded field)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    res.json({
      success: true,
      totalRecords: hospital.totalRecordsAdded || 0,
      todayRecords: 0, // would need a separate DB collection to track this precisely
      activePatients: hospital.totalRecordsAdded || 0,
      totalOnBlockchain: totalOnChain
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/records/recent - Recent records for logged-in hospital (last 5)
router.get("/recent", protect, async (req, res) => {
  try {
    // We can't easily get "only this hospital's records" from blockchain without scanning all
    // So we return empty for now - this is a known limitation of the current contract design
    res.json({
      success: true,
      records: []
    });
  } catch (error) {
    console.error("Recent records error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;