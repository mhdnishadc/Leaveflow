const express = require("express");
const LeaveRequest = require("../models/LeaveRequest");
const authMiddleware = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/adminMiddleware");
const router = express.Router();

// ✅ Get all leave requests
router.get("/leave-requests", authMiddleware, verifyAdmin,  async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find().populate('userId', 'name').sort({ date: -1 }); // Sort by latest
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update leave request status (Approve/Reject)
router.put("/leave-requests/:id", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
