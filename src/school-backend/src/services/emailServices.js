import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// ----------------------
// Generic email sender via Brevo API
// ----------------------
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: process.env.EMAIL_USER, name: "MVM-Athur" },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
      }
    );
    console.log(`✅ Email sent to ${to}:`, response.data);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.response?.data || error.message);
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
    `<p>Hello ${name},</p>
     <p>Thank you for reaching out to Maharishi Vidya Mandir School. Our team will respond shortly.</p>`
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
    parentName,
    contactNumber,
    email,
  } = admissionData;

  const formattedDOB = new Date(dob).toLocaleDateString();

  // Email to Admin
  await sendEmail(
    process.env.ADMIN_EMAIL,
    `🎓 New Admission Form Submission - ${studentName}`,
    `<p>New admission application received:</p>
     <ul>
       <li><strong>Student Name:</strong> ${studentName}</li>
       <li><strong>Date of Birth:</strong> ${formattedDOB}</li>
       <li><strong>Class Applied:</strong> ${classApplied}</li>
       <li><strong>Gender:</strong> ${gender}</li>
       <li><strong>Address:</strong> ${address}</li>
       <li><strong>Parent Name:</strong> ${parentName}</li>
       <li><strong>Contact Number:</strong> ${contactNumber}</li>
       <li><strong>Email:</strong> ${email}</li>
     </ul>`
  );

  // Thank-you email to Parent/User
  await sendEmail(
    email,
    "🎓 Admission Enquiry Received!",
    `<p>Hello ${parentName},</p>
     <p>Thank you for submitting the admission form for ${studentName}. Our team will review and contact you soon.</p>`
  );
};
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
