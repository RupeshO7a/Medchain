const express = require("express");
const router = express.Router();
const Hospital = require('../models/Hospital');
const { protectAdmin } = require("../middleware/auth");

router.get("/hospitals", protectAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status === "pending") filter.isAuthorized = false;
    if (status === "authorized") filter.isAuthorized = true;
    const hospitals = await Hospital.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, total: hospitals.length, hospitals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/authorize/:hospitalId", protectAdmin, async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.hospitalId);
    if (!hospital) return res.status(404).json({ error: "Hospital not found" });

    if (req.contract) {
      const tx = await req.contract.authorizeHospital(hospital.walletAddress, hospital.name);
      await tx.wait();
    }

    hospital.isAuthorized = true;
    await hospital.save();
    res.json({ success: true, message: `${hospital.name} authorized!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/revoke/:hospitalId", protectAdmin, async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.hospitalId);
    if (!hospital) return res.status(404).json({ error: "Hospital not found" });
    hospital.isAuthorized = false;
    await hospital.save();
    res.json({ success: true, message: `${hospital.name} access revoked` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/stats", protectAdmin, async (req, res) => {
  try {
    const totalHospitals = await Hospital.countDocuments();
    const authorizedHospitals = await Hospital.countDocuments({ isAuthorized: true });
    const pendingHospitals = await Hospital.countDocuments({ isAuthorized: false });
    let totalRecords = 0;
    if (req.contract) totalRecords = Number(await req.contract.totalRecords());
    res.json({ success: true, stats: { totalHospitals, authorizedHospitals, pendingHospitals, totalRecordsOnBlockchain: totalRecords } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
