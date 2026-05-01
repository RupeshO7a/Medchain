const jwt = require("jsonwebtoken");
const Hospital = require("../models/Hospital");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ error: "Not logged in" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const hospital = await Hospital.findById(decoded.id);

    if (!hospital) return res.status(401).json({ error: "Hospital not found" });
    if (!hospital.isAuthorized) return res.status(403).json({ error: "Not authorized" });

    req.hospital = hospital;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

const protectAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ error: "Admin access required" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    if (decoded.role !== "admin")
      return res.status(403).json({ error: "Admin access required" });

    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Admin authentication failed" });
  }
};

module.exports = { protect, protectAdmin };
