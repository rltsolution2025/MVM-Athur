import nodemailer from "nodemailer";

// ----------------------
// Create Gmail transporter
// ----------------------
const getTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Gmail address from .env
      pass: process.env.EMAIL_PASS, // Gmail App Password from .env
    },
  });

// ----------------------
// Generic email sender with logging
// ----------------------
export const sendEmail = async (to, subject, text, html = null) => {
  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: `"Maharishi Vidya Mandir" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`✅ Email sent to: ${to} | MessageId: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    console.error(error.stack);
    throw error; // Propagate error so caller knows
  }
};

// ----------------------
// CONTACT FORM EMAILS
// ----------------------
export const sendContactEmails = async (contactData) => {
  const { name, email, phone, location, message } = contactData;

  try {
    // Email to Admin
    await sendEmail(
      process.env.ADMIN_EMAIL,
      `📩 New Contact Form Submission - ${name}`,
      `You received a new contact enquiry:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nLocation: ${location}\nMessage: ${message || "N/A"}`
    );

    // Thank-you Email to User
    await sendEmail(
      email,
      "✅ Thank You for Contacting Us!",
      `Hello ${name},\n\nThank you for reaching out to Maharishi Vidya Mandir School. Our team will respond shortly.\n\nBest Regards,\nMaharishi Vidya Mandir School`
    );
  } catch (error) {
    console.error("❌ sendContactEmails failed:", error.message);
    console.error(error.stack);
  }
};

// ----------------------
// ADMISSION FORM EMAILS
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

  const formattedDOB = dob ? new Date(dob).toLocaleDateString() : "N/A";

  try {
    // Email to Admin
    await sendEmail(
      process.env.ADMIN_EMAIL,
      `🎓 New Admission Form Submission - ${studentName}`,
      `You received a new admission application:\n\nStudent Name: ${studentName}\nDate of Birth: ${formattedDOB}\nClass Applied: ${classApplied}\nGender: ${gender || "N/A"}\nAddress: ${address || "N/A"}\nParent/Guardian: ${parent || "N/A"}\nParent Name: ${parentName || "N/A"}\nContact Number: ${contactNumber}\nEmail ID: ${email}`
    );

    // Thank-you Email to Parent/User
    await sendEmail(
      email,
      "🎓 Admission Enquiry Received!",
      `Hello ${parentName || "Parent"},\n\nThank you for submitting the admission form for ${studentName}. Our admissions team will review the details and get in touch with you soon.\n\nBest Regards,\nMaharishi Vidya Mandir School`
    );
  } catch (error) {
    console.error("❌ sendAdmissionEmails failed:", error.message);
    console.error(error.stack);
  }
};

// ----------------------
// Verify transporter on startup
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
