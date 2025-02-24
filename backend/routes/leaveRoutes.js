const express = require("express");
const multer = require("multer");
const LeaveRequest = require("../models/LeaveRequest");

const router = express.Router();

// Multer setup for file uploads (optional)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

// Apply for Leave
router.post("/apply", async (req, res) => {
  try {
    console.log("Received Request Body:", req.body); // Debugging step

    const { userId, leaveType, startDate, endDate, reason } = req.body;

    if (!userId || !leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const leaveRequest = new LeaveRequest({
      userId,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await leaveRequest.save();
    res.status(201).json({ message: "Leave request submitted successfully" });

  } catch (error) {
    console.error("Error processing leave request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// // Get All Leave Requests (For Dashboard)
// router.get("/all", async (req, res) => {
//   try {
//     const leaveRequests = await LeaveRequest.find().populate("userId", "name email");
//     res.json(leaveRequests);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get Leave Requests for Specific User
// router.get("/user/:userId", async (req, res) => {
//   try {
//     const leaveRequests = await LeaveRequest.find({ userId: req.params.userId });
//     res.json(leaveRequests);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

module.exports = router;
