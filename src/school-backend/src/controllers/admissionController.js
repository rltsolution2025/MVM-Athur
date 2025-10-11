import Admission from "../models/Admission.js";
import { sendAdmissionEmails } from "../services/emailServices.js";
import axios from "axios";

const GOOGLE_ADMISSION_FORM_URL = process.env.GOOGLE_ADMISSION_FORM_URL;

// ---------------- ADMISSION FORM CONTROLLER ----------------
export const submitAdmission = async (req, res) => {
  try {
    console.log("📥 Incoming Admission Request:", req.body);

    // 1️⃣ Validate required fields
    const {
      studentName,
      dob,
      classApplied,
      gender,
      address,
      parent,
      parentName,
      contactNumber,
      email,
    } = req.body;

    if (!studentName || !classApplied || !contactNumber || !email) {
      return res.status(400).json({
        success: false,
        message:
          "Student Name, Class Applied, Contact Number, and Email are required fields.",
      });
    }

    // 2️⃣ Save admission to MongoDB
    const admission = await Admission.create({
      studentName,
      dob,
      classApplied,
      gender,
      address,
      parent,
      parentName,
      contactNumber,
      email,
      submittedAt: new Date(),
    });

    console.log("✅ Admission saved to MongoDB with ID:", admission._id);

    // 3️⃣ Send confirmation/admin emails
    try {
      await sendAdmissionEmails(admission);
      console.log("📧 Admission emails sent successfully!");
    } catch (emailError) {
      console.error("❌ Failed to send admission emails:", emailError.message);
    }

    // 4️⃣ Send data to Google Sheet (Apps Script)
    if (GOOGLE_ADMISSION_FORM_URL) {
      try {
        const payload = {
          StudentName: admission.studentName,
          DOB: admission.dob || "N/A",
          ClassApplied: admission.classApplied,
          Gender: admission.gender || "N/A",
          Address: admission.address || "N/A",
          Parent: admission.parent || "N/A",
          ParentName: admission.parentName || "N/A",
          ContactNumber: admission.contactNumber,
          Email: admission.email,
          SubmittedAt: admission.submittedAt.toISOString(),
        };

        console.log("📤 Sending Admission data to Google Apps Script...");
        const response = await axios.post(GOOGLE_ADMISSION_FORM_URL, payload);
        console.log("✅ Google Sheet (Admission) response:", response.data);
      } catch (scriptError) {
        console.error(
          "❌ Google Apps Script (Admission) error:",
          scriptError.response?.data || scriptError.message
        );
      }
    } else {
      console.warn("⚠️ GOOGLE_ADMISSION_FORM_URL is missing in .env file.");
    }

    // 5️⃣ Respond back to frontend
    res.status(201).json({
      success: true,
      message: "Admission form submitted successfully!",
    });
  } catch (error) {
    console.error("❌ Admission form error (detailed):", error.message);
    console.error(error.stack);

    if (error.response) {
      console.error("📩 External API Response Error:", error.response.data);
    }

    // Respond back with detailed error (helpful for Postman debugging)
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
