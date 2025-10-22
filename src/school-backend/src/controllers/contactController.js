import Contact from "../models/Contact.js";
import { sendContactEmails } from "../services/emailServices.js";

export const submitContact = async (req, res) => {
  try {
    console.log("📩 Incoming Contact Request:", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing. Please send JSON data.",
      });
    }

    const { name, email, phone, location, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, Email, and Phone are required fields.",
      });
    }

    // Save to MongoDB
    const contact = await Contact.create({
      name,
      email,
      phone,
      location: location || "N/A",
      message: message || "N/A",
      timestamp: new Date(),
    });

    console.log("✅ Contact saved to MongoDB with ID:", contact._id);

    // Send emails asynchronously (non-blocking)
    sendContactEmails(contact)
      .then(() => console.log("📧 Contact email sent successfully!"))
      .catch(err => console.error("❌ Failed to send emails:", err.message));

    // Return success response immediately
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
