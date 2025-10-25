import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// ----------------------
// Create transporter for Gmail
// ----------------------
const getTransporter = () => nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App password
  },
  logger: true,  // Logs SMTP info
  debug: true,   // Show SMTP traffic
});

// ---------------------- 
// Generic email sender
// ----------------------
export const sendEmail = async (to, subject, text, html = "") => {
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"Maharishi Vidya Mandir" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html, // optional HTML
    });
    console.log(`✅ Email sent to: ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
  }
};

// ----------------------
// Contact form emails
// ----------------------
export const sendContactEmails = async (contactData) => {
  const { name, email, phone, location, message } = contactData;

  // Email to Admin
  await sendEmail(
    process.env.ADMIN_EMAIL,
    `📩 New Contact Form Submission - ${name}`,
    `You received a new contact enquiry:\n
Name: ${name}
Email: ${email}
Phone: ${phone}
Location: ${location}
Message: ${message || "N/A"}`,
    `<p>You received a new contact enquiry:</p>
     <ul>
       <li><strong>Name:</strong> ${name}</li>
       <li><strong>Email:</strong> ${email}</li>
       <li><strong>Phone:</strong> ${phone}</li>
       <li><strong>Location:</strong> ${location}</li>
       <li><strong>Message:</strong> ${message || "N/A"}</li>
     </ul>`
  );

  // Thank-you email to user
  await sendEmail(
    email,
    "✅ Thank You for Contacting Us!",
    `Hello ${name},\nThank you for reaching out to Maharishi Vidya Mandir School. We have received your enquiry and our team will respond shortly.`,
    `<p>Hello ${name},</p>
     <p>Thank you for reaching out to Maharishi Vidya Mandir School. We have received your enquiry and our team will respond shortly.</p>`
  );
};

// ----------------------
// Admission form emails
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

  // Email to Admin
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
Email ID: ${email}`,
    `<p>You received a new admission application:</p>
     <ul>
       <li><strong>Student Name:</strong> ${studentName}</li>
       <li><strong>Date of Birth:</strong> ${formattedDOB}</li>
       <li><strong>Class Applied:</strong> ${classApplied}</li>
       <li><strong>Gender:</strong> ${gender}</li>
       <li><strong>Address:</strong> ${address}</li>
       <li><strong>Parent / Guardian:</strong> ${parent}</li>
       <li><strong>Parent Name:</strong> ${parentName}</li>
       <li><strong>Contact Number:</strong> ${contactNumber}</li>
       <li><strong>Email:</strong> ${email}</li>
     </ul>`
  );

  // Thank-you email to Parent/User
  await sendEmail(
    email,
    "🎓 Admission Enquiry Received!",
    `Hello ${parentName},\nThank you for submitting the admission form for ${studentName}. Our admissions team will review the details and get in touch with you soon.`,
    `<p>Hello ${parentName},</p>
     <p>Thank you for submitting the admission form for ${studentName}. Our admissions team will review the details and get in touch with you soon.</p>`
  );
};

// ----------------------
// Test transporter
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
