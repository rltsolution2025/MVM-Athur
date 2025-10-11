import Admission from "../models/Admission.js";
import { sendAdmissionEmails } from "../services/emailServices.js";

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

    // 4️⃣ Respond back to frontend
    res.status(201).json({
      success: true,
      message: "Admission form submitted successfully!",
    });
  } catch (error) {
    console.error("❌ Admission form error (detailed):", error.message);
    console.error(error.stack);

    // Respond back with detailed error (helpful for Postman debugging)
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
