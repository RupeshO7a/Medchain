const express = require("express");
const router = express.Router();
const Hospital = require("../models/Hospital");
const { protect } = require("../middleware/auth");

// GET /api/hospitals - list all authorized hospitals
router.get("/", protect, async (req, res) => {
  try {
    const hospitals = await Hospital.find({ isAuthorized: true }).select(
      "name location state registrationNumber walletAddress"
    );
    res.json({ success: true, total: hospitals.length, hospitals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/hospitals/:id - get a single hospital by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).select(
      "name location state registrationNumber walletAddress contactPerson phone email"
    );
    if (!hospital) return res.status(404).json({ error: "Hospital not found" });
    res.json({ success: true, hospital });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;