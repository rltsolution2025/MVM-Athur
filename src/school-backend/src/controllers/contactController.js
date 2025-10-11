import Contact from "../models/Contact.js";
import { sendContactEmails } from "../services/emailServices.js";

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

    // 4️⃣ Respond to frontend
    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully!",
    });
  } catch (error) {
    console.error("❌ Contact form error (detailed):", error.message);
    console.error(error.stack);

    // Respond back with details (for Postman testing)
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
