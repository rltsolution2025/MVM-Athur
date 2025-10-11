import Contact from "../models/Contact.js";
import { sendContactEmails } from "../services/emailServices.js";

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, location, message } = req.body || {};

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, Email, and Phone are required fields.",
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      location: location || "N/A",
      message: message || "N/A",
      timestamp: new Date(),
    });

    console.log("✅ Contact saved to MongoDB with ID:", contact._id);

    try {
      await sendContactEmails(contact);
      console.log("📧 Contact email sent successfully!");
    } catch (emailError) {
      console.error("❌ Failed to send contact emails:", emailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully!",
    });
  } catch (error) {
    console.error("❌ Contact form error (detailed):", error.stack);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
