const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  state: { type: String, required: true },
  pincode: String,
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  walletAddress: { type: String, required: true, unique: true },
  privateKey: { type: String, required: true, select: false },
  isAuthorized: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  contactPerson: String,
  phone: String,
  totalRecordsAdded: { type: Number, default: 0 },
}, { timestamps: true });

// ← Fixed: use async/await instead of callback style
HospitalSchema.pre("save", async function() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

HospitalSchema.methods.comparePassword = async function(entered) {
  return await bcrypt.compare(entered, this.password);
};

HospitalSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.privateKey;
  return obj;
};

module.exports = mongoose.model("Hospital", HospitalSchema);