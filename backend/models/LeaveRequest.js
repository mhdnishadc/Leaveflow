const mongoose = require("mongoose");

const LeaveRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
  leaveType: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  fileUrl: { type: String }, // Optional File Upload
  status: { type: String, default: "Pending" }, // Pending, Approved, Rejected
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LeaveRequest", LeaveRequestSchema);
