import Contact from "../models/Contact.js";
import { sendContactEmails } from "../services/emailServices.js";
import axios from "axios";

const GOOGLE_CONTACT_FORM_URL = process.env.GOOGLE_CONTACT_FORM_URL;

// ---------------- CONTACT FORM CONTROLLER ----------------
export const submitContact = async (req, res) => {
  try {
    console.log("📩 Incoming Contact Request:", req.body);

    // 1️⃣ Validate required fields
    const { name, email, phone, location, message } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, Email, and Phone are required fields.",
      });
    }

    // 2️⃣ Save contact to MongoDB
    const contact = await Contact.create({
      name,
      email,
      phone,
      location,
      message: message || "N/A",
      submittedAt: new Date(),
    });

    console.log("✅ Contact saved to MongoDB with ID:", contact._id);

    // 3️⃣ Send confirmation & admin email
    try {
      await sendContactEmails(contact);
      console.log("📧 Contact email sent successfully!");
    } catch (emailError) {
      console.error("❌ Failed to send contact emails:", emailError.message);
    }

    // 4️⃣ Send data to Google Sheet (Apps Script)
    if (GOOGLE_CONTACT_FORM_URL) {
      try {
        const payload = {
          Name: contact.name,
          Email: contact.email,
          Phone: contact.phone,
          Location: contact.location || "N/A",
          Message: contact.message || "N/A",
          SubmittedAt: contact.submittedAt.toISOString(),
        };

        console.log("📤 Sending Contact data to Google Apps Script...");
        const response = await axios.post(GOOGLE_CONTACT_FORM_URL, payload);
        console.log("✅ Google Sheet Response:", response.data);
      } catch (scriptError) {
        console.error(
          "❌ Google Apps Script (Contact) error:",
          scriptError.response?.data || scriptError.message
        );
      }
    } else {
      console.warn("⚠️ Missing GOOGLE_CONTACT_FORM_URL in .env file.");
    }

    // 5️⃣ Respond to frontend
    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully!",
    });
  } catch (error) {
    console.error("❌ Contact form error (detailed):", error.message);
    console.error(error.stack);

    // If error came from external API (Google Script, Email, etc.)
    if (error.response) {
      console.error("📩 External API Response Error:", error.response.data);
    }

    // Respond back with details (for Postman testing)
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
