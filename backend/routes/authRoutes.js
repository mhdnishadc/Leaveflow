const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const passport = require("passport");
const cors = require("cors"); // Add this import
require("../config/passport"); // Google Auth setup
const authMiddleware = require("../middleware/authMiddleware"); 
const router = express.Router();

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
 
router.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Google OAuth Route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { session: false }), async (req, res) => {
  const { name, email, id } = req.user;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, googleId: id, role: "user" });
      await user.save();
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.redirect(`http://localhost:5173/login?token=${token}&role=${user.role}`);
  } catch (error) {
    res.status(500).json({ message: "Google Authentication failed" });
  }
});


// 🟢 Fetch User Info (Protected Route)
router.get("/dashboard", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
});
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email"); // Fetch only necessary fields
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
