const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const LeaveRequest = require("../models/LeaveRequest"); // Ensure this line is present
const cors = require("cors"); // Add this import
const authMiddleware = require("../middleware/authMiddleware"); 
const multer = require("multer");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();
require("dotenv").config(); 
const cloudinary = require("../config/cloudinaryConfig");
const upload = require("../middleware/multer");
const DataUriParser = require("datauri/parser");
const path = require("path");
 
const parser = new DataUriParser();

// Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", email);
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, role: user.role });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
 
router.post("/firebase-login", async (req, res) => {
  const { name, email, firebaseId } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, firebaseId, role: "user" });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, role: user.role });
  } catch (error) {
    console.error("Firebase Authentication Error:", error);
    res.status(500).json({ message: "Firebase Authentication failed" });
  }
});

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    console.log("User ID from middleware:", req.user.id); // Debugging

    // Fetch user details
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch recent leave requests for this user from LeaveRequests collection
    const leaveRequests = await LeaveRequest.find({ userId: req.user.id })
      .sort({ createdAt: -1 }) // Sort by latest requests
      .limit(5); // Limit to last 5 requests

    // Prepare response data
    res.json({
      name: user.name,
      email: user.email,
      leaveBalance: user.leaveBalance || 0,
      pendingRequests: leaveRequests.filter(req => req.status === "Pending").length,
      approvedLeaves: leaveRequests.filter(req => req.status === "Approved").length,
      recentRequests: leaveRequests.map(req => ({
        type: req.leaveType, // Fetch leave type
        date: new Date(req.startDate).toISOString().split("T")[0], // Format date
        status: req.status // Fetch status
      }))
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
 
// Upload Profile Image Route
router.post("/upload-profile", verifyToken, upload.single("profileImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Convert buffer to Data URI
    const fileExt = path.extname(req.file.originalname).toString();
    const file64 = parser.format(fileExt, req.file.buffer);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file64.content);

    // ✅ Store Cloudinary URL in MongoDB (Update User Profile)
    const userId = req.user.id; // Get logged-in user ID from token
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: result.secure_url }, // Save Cloudinary URL in DB
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile image uploaded and saved",
      imageUrl: result.secure_url, // Return the Cloudinary image URL
    });
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    res.status(500).json({ success: false, message: "Upload failed", error: error.message });
  }
});

router.get("/upload-profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email profileImage department");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


// Update Password
router.put("/update-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // Assuming you get `req.user` from middleware

    // Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });

    // Hash and update the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
// Update Department
router.post("/update-department", authMiddleware, async (req, res) => {
  try {
    const { department } = req.body;
    const userId = req.user.id; // Assuming authentication middleware

    const user = await User.findByIdAndUpdate(userId, { department }, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Department updated successfully!", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;




