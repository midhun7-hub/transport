require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log("Testing email with user:", process.env.SMTP_USER);
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER, 
                pass: process.env.SMTP_PASS, 
            },
        });

        const mailOptions = {
            from: `"Test" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            subject: "Test Email",
            text: "This is a test email.",
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully: ", info.response);
    } catch (error) {
        console.error("Error sending email: ", error);
    }
}

testEmail();
