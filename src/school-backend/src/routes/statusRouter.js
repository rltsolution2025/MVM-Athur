import express from "express";
import { submitContact } from "../controllers/contactController.js";
import Contact from "../models/Contact.js"; // import model for GET

const router = express.Router();

// GET route (for testing only)
router.get("/", async (req, res) => {
    res.status(200).json({ message:"success" });
});

export default router;
