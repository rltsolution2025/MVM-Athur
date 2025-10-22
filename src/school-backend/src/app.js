import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import connectDB from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";
import admissionRoutes from "./routes/admissionRoutes.js";
import statusRoutes from "./routes/statusRouter.js";
import { verifyTransporter } from "./services/emailServices.js";

verifyTransporter(); // 

// ----------------------
// Load environment variables
// ----------------------
dotenv.config({ path: path.resolve("./.env") });
console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "✅ Loaded" : "❌ Missing");

// ----------------------
// Initialize Express app
// ----------------------
const app = express();

// ----------------------
// Security headers (Helmet)
// ----------------------
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Prevents CORS conflicts
  })
);

// Prevent MIME type sniffing
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

// ----------------------
// Universal CORS configuration
// ----------------------
app.use(
  cors({
    origin: "*", // Allow all origins (adjust in production)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ----------------------
// Body parsers
// ----------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ----------------------
// Connect MongoDB
// ----------------------
connectDB();

// ----------------------
// API routes
// ----------------------
app.use("/api/contact", contactRoutes);
app.use("/api/admission", admissionRoutes);
app.use("/api/status", statusRoutes);

// ----------------------
// Root route
// ----------------------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "✅ MVM-Athur Backend is running successfully",
    environment: process.env.NODE_ENV || "development",
  });
});

// ----------------------
// 404 handler
// ----------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// ----------------------
// Global Error Handler
// ----------------------
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ----------------------
// Start server
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
