import Contact from "../models/Contact.js";
import { sendContactEmails } from "../services/emailServices.js";
import axios from "axios";

const GOOGLE_CONTACT_FORM_URL = process.env.GOOGLE_CONTACT_FORM_URL;

// ---------------- CONTACT FORM ----------------
export const submitContact = async (req, res) => {
  try {
    // 1. Save to MongoDB
    const contact = await Contact.create(req.body);

    // 2. Send confirmation/admin emails
    await sendContactEmails(contact);

    // 3. Send data to Google Sheet (via Apps Script)
    if (GOOGLE_CONTACT_FORM_URL) {
      try {
        const payload = {
          Name: contact.name,
          Email: contact.email,
          Phone: contact.phone,
          Location: contact.location,
          Message: contact.message || "N/A"
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

    // 4. Respond back to frontend
    res
      .status(201)
      .json({ success: true, message: "Contact form submitted successfully!" });
  } catch (error) {
    console.error("❌ Contact form error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
