const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },  // Will be empty for Google OAuth users
  role: { type: String, enum: ["user", "admin"], default: "user" },
  googleId: { type: String },  // For Google authentication
  leaveBalance: { type: Number, default: 12 },
  pendingRequests: { type: Number, default: 0 },
  approvedLeaves: { type: Number, default: 0 },
  recentRequests: [
    {
      type: { type: String },
      date: { type: String },
      status: { type: String, enum: ["Approved", "Pending", "Rejected"] },
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
