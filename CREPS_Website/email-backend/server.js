// Import core dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config(); 

// Initialize Express application
const app = express();
const PORT = 3001; 

// Configure middleware
app.use(cors());
app.use(bodyParser.json()); 

// Email submission endpoint
app.post("/send-email", async (req, res) => {
  // Destructure form data from request body
  const { firstName, lastName, email, phone, subject, message } = req.body;

  try {
    // Create SMTP transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.SENDER_EMAIL, 
        pass: process.env.GMAIL_APP_PASSWORD, // App-specific password
      },
    });

    // Configure email message
    await transporter.sendMail({
      from: `"Contact Form" <${process.env.SENDER_EMAIL}>`, 
      to: process.env.MANAGER_EMAIL, 
      replyTo: email, 
      subject: `New Message: ${subject}`, 
      text: ` // Plain text email body
You received a new message from the website contact form:

First Name: ${firstName}
Last Name: ${lastName}
Email: ${email}
Phone: ${phone}
Subject: ${subject}
Message:
${message}
      `,
    });

    // Success response
    res.status(200).json({ message: "✅ Email sent successfully!" });
  } catch (error) {
    // Error handling
    console.error("❌ Error sending email:", error);
    res.status(500).json({ message: "❌ Failed to send email." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});