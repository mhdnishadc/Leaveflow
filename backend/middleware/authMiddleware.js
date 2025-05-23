const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access Denied. No Token Provided" });
    }

    console.log("🔹 Token received:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", decoded);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      console.log("❌ User not found in database.");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User authenticated:", req.user.email);
    next();
  } catch (error) {
    console.error("❌ Middleware authentication error:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};



module.exports =  authMiddleware;


