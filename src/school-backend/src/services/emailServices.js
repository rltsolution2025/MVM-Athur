import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

// ----------------------
// Set SendGrid API Key
// ----------------------
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ----------------------
// Generic email sender
// ----------------------
export const sendEmail = async (to, subject, text, html = "") => {
  try {
    const msg = {
      to,
      from: process.env.ADMIN_EMAIL, // Must be verified in SendGrid
      subject,
      text,
      html: html || "", // Ensure html is always a string
    };
    await sgMail.send(msg);
    console.log(`✅ Email sent to: ${to}`);
  } catch (error) {
    console.error(
      `❌ Failed to send email to ${to}:`,
      error.response?.body || error.message
    );
  }
};

// ----------------------
// 📩 CONTACT FORM EMAILS
// ----------------------
export const sendContactEmails = async (contactData) => {
  const { name, email, phone, location, message } = contactData;

  // 1️⃣ Email to Admin
  await sendEmail(
    process.env.ADMIN_EMAIL,
    `📩 New Contact Form Submission - ${name}`,
    `You received a new contact enquiry:\n
Name: ${name}
Email: ${email}
Phone: ${phone}
Location: ${location}
Message: ${message || "N/A"}`
  );

  // 2️⃣ Thank-you Email to User
  await sendEmail(
    email,
    "✅ Thank You for Contacting Us!",
    `Hello ${name},\n
Thank you for reaching out to Maharishi Vidya Mandir School.
We have received your enquiry and our team will respond shortly.\n
Best Regards,
Maharishi Vidya Mandir School`
  );
};

// ----------------------
// 🎓 ADMISSION FORM EMAILS
// ----------------------
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

  const formattedDOB = new Date(dob).toLocaleDateString();

  // 1️⃣ Email to Admin
  await sendEmail(
    process.env.ADMIN_EMAIL,
    `🎓 New Admission Form Submission - ${studentName}`,
    `You received a new admission application:\n
Student Name: ${studentName}
Date of Birth: ${formattedDOB}
Class Applied: ${classApplied}
Gender: ${gender}
Address: ${address}
Parent / Guardian: ${parent}
Parent Name: ${parentName}
Contact Number: ${contactNumber}
Email ID: ${email}`
  );

  // 2️⃣ Thank-you Email to Parent/User
  await sendEmail(
    email,
    "🎓 Admission Enquiry Received!",
    `Hello ${parentName},\n
Thank you for submitting the admission form for ${studentName}.
Our admissions team will review the details and get in touch with you soon.\n
Best Regards,
Maharishi Vidya Mandir School`
  );
};

// ----------------------
// Optional: Test SendGrid API on startup
// ----------------------
export const verifyTransporter = async () => {
  try {
    await sgMail.send({
      to: process.env.ADMIN_EMAIL,
      from: process.env.ADMIN_EMAIL,
      subject: "✅ Test Email from MVM-Athur",
      text: "SendGrid transporter is working properly!",
      html: "<p>SendGrid transporter is working properly!</p>",
    });
    console.log("✅ SendGrid transporter ready to send emails");
  } catch (error) {
    console.error(
      "❌ SendGrid transporter verification failed:",
      error.response?.body || error.message
    );
  }
};
