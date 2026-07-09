import Contact from '../models/Contact.js';
import { Resend } from "resend";

// SUBMIT CONTACT
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body;

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      phone
    });

    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is missing");
    }

    if (!process.env.ADMIN_EMAIL) {
      throw new Error("ADMIN_EMAIL is missing");
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // 1️⃣ User acknowledgment email
    await resend.emails.send({
      from: "Raqsa Store <onboarding@resend.dev>",
      to: email,
      subject: "Thank you for contacting Raqsa Store",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>Hi ${name},</h2>
          <p>
            Thank you for reaching out to <strong>Raqsa Store</strong>.
            We’ve received your message and our team will get back to you shortly.
          </p>

          <hr />

          <p><strong>Your message:</strong></p>
          <p style="background:#f6f6f6;padding:10px;border-radius:5px;">
            ${message}
          </p>

          <p style="margin-top:20px;">
            Best regards,<br/>
            <strong>Raqsa Team</strong>
          </p>

          <p style="font-size:12px;color:#888;">
            This is an automated message. Please do not reply.
          </p>
        </div>
      `,
    });

    // 2️⃣ Admin notification email
    await resend.emails.send({
      from: "Raqsa Store <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL,
      subject: "📩 New Contact Form Submission",
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Subject:</strong> ${subject}</p>

        <hr />

        <p><strong>Message:</strong></p>
        <p>${message}</p>

        <hr />
        <p>Contact ID: ${contact._id}</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      contactId: contact._id
    });

  } catch (error) {
    console.error("CONTACT ERROR:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET ALL CONTACTS (Vendor/Admin)
export const getAllContacts = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE CONTACT STATUS + SEND REPLY EMAIL
export const updateContactStatus = async (req, res) => {
  try {
    const { status, replyMessage } = req.body;

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    contact.status = status;
    contact.replyMessage = replyMessage;
    contact.repliedAt = new Date();
    await contact.save();

    // 📧 Send reply email to customer
    if (replyMessage) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "Raqsa Store <onboarding@resend.dev>",
        to: contact.email,
        subject: "📨 Reply from Raqsa Store",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h2>Hi ${contact.name},</h2>

            <p>Thank you for contacting Raqsa Store. Here is our response:</p>

            <blockquote style="background:#f6f6f6;padding:12px;border-left:4px solid #7c3aed;">
              ${replyMessage}
            </blockquote>

            <hr />

            <p><strong>Your original message:</strong></p>
            <p>${contact.message}</p>

            <p style="margin-top:20px;">
              — <strong>Raqsa Support Team</strong>
            </p>

            <p style="font-size:12px;color:#888;">
              This is an automated message. Please do not reply.
            </p>
          </div>
        `,
      });
    }

    res.json({
      success: true,
      message: 'Contact updated and reply sent',
      contact
    });

  } catch (error) {
    console.error("UPDATE CONTACT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
