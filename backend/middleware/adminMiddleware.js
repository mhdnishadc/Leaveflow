const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config();

// ✅ Middleware to verify admin role
const verifyAdmin = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized access" });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  
module.exports =  verifyAdmin;