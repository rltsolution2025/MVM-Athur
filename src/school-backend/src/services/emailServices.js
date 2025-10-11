import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ----------------------
// Generic email sender
// ----------------------
export const sendEmail = async (to, subject, text, html = null) => {
  try {
    await sgMail.send({
      to,
      from: process.env.ADMIN_EMAIL, // verified sender in SendGrid
      subject,
      text,
      html,
    });
    console.log(`✅ Email sent to: ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
};

// ----------------------
// CONTACT FORM EMAILS
// ----------------------
export const sendContactEmails = async (contactData) => {
  const { name, email, phone, location, message } = contactData;

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
};
