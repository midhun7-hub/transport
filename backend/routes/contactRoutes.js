const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// POST /api/contact
router.post("/", async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "Name, email, and message are required." });
    }

    try {
        // Create a transporter using SMTP settings from .env
        // Defaulting to Brevo's relay since it was used previously
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER, 
                pass: process.env.SMTP_PASS, 
            },
        });

        // Email options
        const mailOptions = {
            from: `"${name}" <${process.env.SMTP_USER || email}>`, // It's safer to send from the authenticated SMTP_USER to avoid spam filters, and reply-to the user
            replyTo: email,
            to: "midhun77msdcr@gmail.com", // The final destination
            subject: `New Contact Form Submission from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\n\nMessage:\n${message}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #2563eb;">New CargoLink Contact Request 🚚</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;" />
                    <h3>Message:</h3>
                    <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 8px;">${message}</p>
                </div>
            `,
        };

        // Send mail
        await transporter.sendMail(mailOptions);
        
        console.log(`✅ Contact email sent from ${email}`);
        res.status(200).json({ message: "Message sent successfully!" });

    } catch (error) {
        console.error("Email sending error:", error);
        res.status(500).json({ message: "Failed to send message. Please ensure SMTP credentials are configured." });
    }
});

module.exports = router;
