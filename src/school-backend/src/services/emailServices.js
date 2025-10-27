import brevo from "@getbrevo/brevo";
import dotenv from "dotenv";
dotenv.config();

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.authentications['apiKey'].apiKey = process.env.BREVO_API_KEY;

try {
  const account = await accountApi.getAccount();
  console.log("✅ API Verified:", account.email);
} catch (error) {
  console.error("❌ Invalid API key:", error.response?.body || error.message);
}

/**
 * ✅ Generic email sender
 */
export const sendEmail = async (to, subject, text, html = "") => {
  try {
    const email = new Brevo.SendSmtpEmail();
    email.sender = {
      name: "Maharishi Vidya Mandir",
      email: process.env.ADMIN_EMAIL,
    };
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

/**
 * 📩 Contact Form Email
 */
export const sendContactEmails = async (contactData) => {
  const { name, email, phone, location, message } = contactData;

  await sendEmail(
    process.env.ADMIN_EMAIL,
    `📩 New Contact Form Submission - ${name}`,
    `New enquiry received:\n
    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    Location: ${location}
    Message: ${message}`
  );

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

  await sendEmail(
    email,
    "🎓 Admission Enquiry Received!",
    `Hello ${parentName},\n\nThank you for submitting the admission form for ${studentName}.\nOur admissions team will contact you soon.\n\nWarm Regards,\nMaharishi Vidya Mandir School`
  );
};

/**
 * 🔍 Verify Brevo API Key (for testing)
 */
export const verifyTransporter = async () => {
  try {
    const accountApi = new Brevo.AccountApi();
    accountApi.authentications.apiKey.apiKey = process.env.BREVO_API_KEY;

    const account = await accountApi.getAccount();
    console.log("✅ Brevo API key verified for:", account.email);
  } catch (error) {
    console.error("❌ Invalid Brevo API key (401 Unauthorized). Please generate a new one.");
  }
};
