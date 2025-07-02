const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();                  // ✅ Load .env
connectDB();                      // ✅ Connect to MongoDB

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dice", require("./routes/Diceroutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
