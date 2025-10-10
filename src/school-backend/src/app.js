import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";
import admissionRoutes from "./routes/admissionRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();

// ✅ Step 1: Enable CORS — put this BEFORE your routes and body parser
app.use(cors({
  origin: true,
  credentials: true,
}));

// ✅ Step 2: Parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Step 3: Connect to MongoDB
connectDB();

// ✅ Step 4: Routes
app.use("/api/contact", contactRoutes);
app.use("/api/admission", admissionRoutes);

// ✅ Step 5: Health check route for Render
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully");
});

// ✅ Step 6: Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(500).json({ message: err.message });
});

// ✅ Step 7: Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
