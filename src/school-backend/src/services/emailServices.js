import nodemailer from "nodemailer";

// ----------------------
// Lazy transporter creation to ensure env variables are loaded
// ----------------------
const getTransporter = () => nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Gmail address from .env
    pass: process.env.EMAIL_PASS, // Gmail App Password from .env
  },
});

// ----------------------
// Generic email sender
// ----------------------
export const sendEmail = async (to, subject, text, html = null) => {
  try {
    const transporter = getTransporter(); // create transporter here
    await transporter.sendMail({
      from: `"Maharishi Vidya Mandir" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    //console.log(`✅ Email sent to: ${to}`);
    
  } catch (error) {
    //console.error(`❌ Failed to send email to ${to}:`, error.message);
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

  // Format DOB nicely
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
// Optional: Test transporter on startup
// ----------------------
export const verifyTransporter = () => {
  const transporter = getTransporter();
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ Transporter verification failed:", error.message);
    } else {
      console.log("✅ Transporter ready to send emails");
    }
  });
};
console.log(`✅ Email sent to: admin@example.com | MessageId: <...>
✅ Email sent to: user@example.com | MessageId: <...>`)