import Admission from "../models/Admission.js";
import { sendAdmissionEmails } from "../services/emailServices.js";
import axios from "axios";

const GOOGLE_ADMISSION_FORM_URL = process.env.GOOGLE_ADMISSION_FORM_URL;

// ---------------- ADMISSION FORM ----------------
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
        message: "Student name, class applied, contact number, and email are required.",
      });
    }

    // 2️⃣ Save to MongoDB
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
    });

    console.log("✅ Admission saved to MongoDB:", admission._id);

    // 3️⃣ Send emails
    try {
      await sendAdmissionEmails(admission);
      console.log("📧 Admission emails sent successfully");
    } catch (emailError) {
      console.error("❌ Failed to send admission emails:", emailError.message);
    }

    // 4️⃣ Send data to Google Sheet (via Apps Script)
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
        };

        console.log("📤 Sending Admission to Google Apps Script:", payload);
        const response = await axios.post(GOOGLE_ADMISSION_FORM_URL, payload);
        console.log("✅ Google Sheet (Admission) response:", response.data);
      } catch (scriptError) {
        console.error(
          "❌ Google Apps Script (Admission) error:",
          scriptError.response?.data || scriptError.message
        );
      }
    } else {
      console.warn("⚠️ GOOGLE_ADMISSION_FORM_URL is missing in .env");
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

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message, // ✅ Helpful for Postman testing
    });
  }
};
