const express = require("express");
const User = require("../models/User"); 
const authMiddleware = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/adminMiddleware");


const router = express.Router();

// Get all employees
router.get("/", authMiddleware, verifyAdmin, async (req, res) => {
    try {
      const employees = await User.find({ role: { $ne: "admin" } }).select("name department email");
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

// Add new employee
router.post("/", async (req, res) => {
  const { name, department, email } = req.body;
  try {
    const newEmployee = new User({ name, department, email });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ message: "Error adding employee" });
  }
});

// Update employee
router.put("/:id", async (req, res) => {
  try {
    const updatedEmployee = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ message: "Error updating employee" });
  }
});

// Delete employee
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting employee" });
  }
});

module.exports = router;
