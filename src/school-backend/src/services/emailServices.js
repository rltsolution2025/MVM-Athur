import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

/**
 * ✅ Create a reusable transporter using Gmail SMTP
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * ✅ Verify transporter
 */
export const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log("✅ Gmail SMTP transporter verified successfully!");
  } catch (error) {
    console.error("❌ Gmail SMTP verification failed:", error.message);
  }
};

/**
 * ✅ Generic email sender
 */
export const sendEmail = async (to, subject, text, html = "") => {
  try {
    const mailOptions = {
      from: `"Maharishi Vidya Mandir" <${process.env.ADMIN_EMAIL}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to: ${to} | Message ID: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
  }
};

/**
 * 📩 Contact Form Email
 */
export const sendContactEmails = async (contactData) => {
  const { name, email, phone, location, message } = contactData;

  // Send to Admin
  await sendEmail(
    process.env.ADMIN_EMAIL,
    `📩 New Contact Form Submission - ${name}`,
    `New enquiry received:
Name: ${name}
Email: ${email}
Phone: ${phone}
Location: ${location}
Message: ${message}`
  );

  // Auto reply to user
  await sendEmail(
    email,
    "✅ Thank You for Contacting Us!",
    `Hello ${name},\n\nThank you for reaching out to Maharishi Vidya Mandir School.\nWe’ll get back to you soon.\n\nRegards,\nMaharishi Vidya Mandir`
  );
};

/**
 * 🎓 Admission Form Email
 */
export const sendAdmissionEmails = async (admissionData) => {
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
  } = admissionData;

  const formattedDOB = dob ? new Date(dob).toLocaleDateString("en-IN") : "N/A";

  // Send to Admin
  await sendEmail(
    process.env.ADMIN_EMAIL,
    `🎓 New Admission Form Submission - ${studentName}`,
    `Student Name: ${studentName}
DOB: ${formattedDOB}
Class Applied: ${classApplied}
Gender: ${gender}
Address: ${address}
Parent / Guardian: ${parent}
Parent Name: ${parentName}
Contact: ${contactNumber}
Email: ${email}`
  );

  // Auto reply to parent
  await sendEmail(
    email,
    "🎓 Admission Enquiry Received!",
    `Hello ${parentName},\n\nThank you for submitting the admission form for ${studentName}.\nOur admissions team will contact you soon.\n\nWarm Regards,\nMaharishi Vidya Mandir School`
  );
};
