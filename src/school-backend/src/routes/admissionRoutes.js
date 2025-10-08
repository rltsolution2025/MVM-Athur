import express from "express";
import { submitAdmission } from "../controllers/admissionController.js";
import Admission from "../models/Admission.js"; // Import model for GET testing

const router = express.Router();

// POST route: submit a new admission
router.post("/", submitAdmission);

// GET route: fetch all admissions (for testing)
router.get("/", async (req, res) => {
  try {
    const admissions = await Admission.find();
    res.json(admissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
