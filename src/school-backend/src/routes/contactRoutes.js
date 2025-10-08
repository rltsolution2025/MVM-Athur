import express from "express";
import { submitContact } from "../controllers/contactController.js";
import Contact from "../models/Contact.js"; // import model for GET

const router = express.Router();

// POST route (existing)
router.post("/", submitContact);

// GET route (for testing only)
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
