import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";
import admissionRoutes from "./routes/admissionRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to DB
connectDB();

// Routes
app.use("/api/contact", contactRoutes);
app.use("/api/admission", admissionRoutes);

// ✅ Test route for Render health check
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(500).json({ message: err.message });
});

// Render provides PORT environment variable automatically
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
