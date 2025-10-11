import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import connectDB from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";
import admissionRoutes from "./routes/admissionRoutes.js";
import statusRoutes from "./routes/statusRouter.js";

// ✅ Load environment variables
dotenv.config({ path: path.resolve("./.env") });

// ✅ Debug log (check if .env is loaded)
console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "✅ Loaded" : "❌ Missing");

const app = express();

// ✅ Enable CORS for both frontend (Angular) and Postman
app.use(
  cors({
    origin: "*", // or replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ Body parsers (for JSON, form data, etc.)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Connect MongoDB
connectDB();

// ✅ Routes
app.use("/api/contact", contactRoutes);
app.use("/api/admission", admissionRoutes);
app.use("/api/status", statusRoutes);

// ✅ Root health route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "✅ MVM-Athur Backend is running successfully",
    environment: process.env.NODE_ENV || "development",
  });
});

// ✅ 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
