import Admission from "../models/Admission.js";
import { sendAdmissionEmails } from "../services/emailServices.js";

export const submitAdmission = async (req, res) => {
  try {
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
    } = req.body || {};

    if (!studentName || !classApplied || !contactNumber || !email) {
      return res.status(400).json({
        success: false,
        message:
          "Student Name, Class Applied, Contact Number, and Email are required fields.",
      });
    }

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
      timestamp: new Date(),
    });

    console.log("✅ Admission saved to MongoDB with ID:", admission._id);

    try {
      await sendAdmissionEmails(admission);
      console.log("📧 Admission emails sent successfully!");
    } catch (emailError) {
      console.error("❌ Failed to send admission emails:", emailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Admission form submitted successfully!",
    });
  } catch (error) {
    console.error("❌ Admission form error (detailed):", error.stack);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
