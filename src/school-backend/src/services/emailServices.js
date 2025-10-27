import Brevo from "@getbrevo/brevo";
import dotenv from "dotenv";
dotenv.config();

const brevo = new Brevo.TransactionalEmailsApi();
brevo.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

// ✅ Generic email sender
export const sendEmail = async (to, subject, text, html = "") => {
  try {
    const email = new Brevo.SendSmtpEmail();
    email.sender = { name: "Maharishi Vidya Mandir", email: process.env.ADMIN_EMAIL };
    email.to = [{ email: to }];
    email.subject = subject;
    email.textContent = text;
    if (html) email.htmlContent = html;

    const result = await brevo.sendTransacEmail(email);
    console.log(`✅ Email sent to: ${to} | Message ID: ${result?.messageId || "OK"}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
  }
};

// 📩 Contact form emails
export const sendContactEmails = async (contactData) => {
  const { name, email, phone, location, message } = contactData;

  await sendEmail(
    process.env.ADMIN_EMAIL,
    `📩 New Contact Form Submission - ${name}`,
    `New enquiry from ${name}\nEmail: ${email}\nPhone: ${phone}\nLocation: ${location}\nMessage: ${message}`
  );

  await sendEmail(
    email,
    "✅ Thank You for Contacting Us!",
    `Hello ${name},\nThank you for reaching out to Maharishi Vidya Mandir School.\nWe have received your enquiry and will respond shortly.`
  );
};

// 🎓 Admission form emails
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

  await sendEmail(
    process.env.ADMIN_EMAIL,
    `🎓 New Admission Form Submission - ${studentName}`,
    `Student Name: ${studentName}\nDOB: ${formattedDOB}\nClass: ${classApplied}\nParent: ${parentName}\nContact: ${contactNumber}\nEmail: ${email}`
  );

  await sendEmail(
    email,
    "🎓 Admission Enquiry Received!",
    `Hello ${parentName},\nThank you for submitting the admission form for ${studentName}. We’ll get in touch soon.`
  );
};
