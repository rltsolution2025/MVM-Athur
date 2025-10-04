import Admission from "../models/Admission.js";
import { sendAdmissionEmails } from "../services/emailServices.js";
import axios from "axios";

const GOOGLE_ADMISSION_FORM_URL = process.env.GOOGLE_ADMISSION_FORM_URL;

// ---------------- ADMISSION FORM ----------------
export const submitAdmission = async (req, res) => {
  try {
    // 1. Save to MongoDB
    const admission = await Admission.create(req.body);

    // 2. Send emails
    await sendAdmissionEmails(admission);

    // 3. Send data to Google Sheet (via Apps Script)
    if (GOOGLE_ADMISSION_FORM_URL) {
      try {
        const payload = {
          StudentName: admission.studentName,
          DOB: admission.dob, // stored in ISO, Apps Script can parse
          ClassApplied: admission.classApplied,
          Gender: admission.gender,
          Address: admission.address,
          Parent: admission.parent,
          ParentName: admission.parentName,
          ContactNumber: admission.contactNumber,
          Email: admission.email
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

    // 4. Respond back to frontend
    res
      .status(201)
      .json({ success: true, message: "Admission form submitted successfully!" });
  } catch (error) {
    console.error("❌ Admission form error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
