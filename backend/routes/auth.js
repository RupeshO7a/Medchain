const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { ethers } = require("ethers");
const Hospital = require('../models/Hospital');

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const hospital = await Hospital.findOne({ email }).select("+password");
    if (!hospital)
      return res.status(401).json({ error: "Invalid email or password" });

    const isCorrect = await hospital.comparePassword(password);
    if (!isCorrect)
      return res.status(401).json({ error: "Invalid email or password" });

    if (!hospital.isAuthorized)
      return res.status(403).json({ error: "Hospital not yet authorized by government" });

    const token = jwt.sign(
      { id: hospital._id, walletAddress: hospital.walletAddress, name: hospital.name },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "8h" }
    );

    res.json({
      success: true,
      token,
      hospital: {
        id: hospital._id,
        name: hospital.name,
        email: hospital.email,
        location: hospital.location,
        state: hospital.state,
        walletAddress: hospital.walletAddress,
        registrationNumber: hospital.registrationNumber,
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const {
      hospitalName, name,
      registrationNumber,
      address, location,
      city,
      state, pincode,
      email, password,
      contactPerson, phone
    } = req.body;

    const resolvedName = name || hospitalName;
    const resolvedLocation = location || (city ? `${address}, ${city}` : address);

    if (!resolvedName || !resolvedLocation || !registrationNumber || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await Hospital.findOne({
      $or: [{ email }, { registrationNumber }]
    });
    if (existing)
      return res.status(400).json({ error: "Hospital already exists with this email or registration number" });

    const wallet = ethers.Wallet.createRandom();

    await Hospital.create({
      name: resolvedName,
      registrationNumber,
      location: resolvedLocation,
      state,
      pincode,
      email,
      password,
      contactPerson,
      phone,
      walletAddress: wallet.address,
      privateKey: wallet.privateKey,
      isAuthorized: false,
    });

    res.status(201).json({
      success: true,
      message: "Registration submitted! Wait for government approval.",
      walletAddress: wallet.address,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD)
      return res.status(401).json({ error: "Invalid admin credentials" });

    const token = jwt.sign(
      { role: "admin", email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "8h" }
    );
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ error: "Admin login failed" });
  }
});

module.exports = router;