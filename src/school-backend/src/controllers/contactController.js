import Contact from "../models/Contact.js";
import { sendContactEmails } from "../services/emailServices.js";
import axios from "axios";

const GOOGLE_CONTACT_FORM_URL = process.env.GOOGLE_CONTACT_FORM_URL;

// ---------------- CONTACT FORM ----------------
export const submitContact = async (req, res) => {
  try {
    console.log("📩 Incoming Contact Request:", req.body);

    // 1️⃣ Validate required fields
    const { name, email, phone, location, message } = req.body;
    if (!name || !email || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "Name, email, and phone are required." });
    }

    // 2️⃣ Save to MongoDB
    const contact = await Contact.create({
      name,
      email,
      phone,
      location,
      message: message || "N/A",
    });
    console.log("✅ Contact saved to MongoDB:", contact._id);

    // 3️⃣ Send confirmation/admin emails
    try {
      await sendContactEmails(contact);
      console.log("📧 Contact email sent successfully");
    } catch (emailError) {
      console.error("❌ Failed to send contact emails:", emailError.message);
    }

    // 4️⃣ Send data to Google Sheet (via Apps Script)
    if (GOOGLE_CONTACT_FORM_URL) {
      try {
        const payload = {
          Name: contact.name,
          Email: contact.email,
          Phone: contact.phone,
          Location: contact.location,
          Message: contact.message || "N/A",
        };

        console.log("📤 Sending Contact to Google Apps Script:", payload);
        const response = await axios.post(GOOGLE_CONTACT_FORM_URL, payload);
        console.log("✅ Google Sheet (Contact) response:", response.data);
      } catch (scriptError) {
        console.error(
          "❌ Google Apps Script (Contact) error:",
          scriptError.response?.data || scriptError.message
        );
      }
    } else {
      console.warn("⚠️ GOOGLE_CONTACT_FORM_URL is missing in .env");
    }

    // 5️⃣ Respond back to frontend
    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully!",
    });
  } catch (error) {
    console.error("❌ Contact form error (detailed):", error.message);
    console.error(error.stack);

    if (error.response) {
      console.error("📩 External API Response Error:", error.response.data);
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message, // ✅ Helpful for Postman debugging
    });
  }
};
