require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const Authadmin = require("./routes/Authadmin");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();



// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);

app.use("/api/admin", Authadmin);
app.use("/api/employees", employeeRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
