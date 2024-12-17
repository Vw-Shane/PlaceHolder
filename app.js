const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const port = 8888;

require('dotenv').config(); // For environment variables

// Set up Nodemailer transporter with Hover SMTP
const transporter = nodemailer.createTransport({
  host: 'mail.hover.com', // Hover SMTP server
  port: 587,              // Use port 587 for STARTTLS
  secure: false,          // False for STARTTLS; true for SSL port 465
  auth: {
    user: process.env.EMAIL_USER, // Your Hover email
    pass: process.env.EMAIL_PASS, // Your Hover password
  },
});

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// EJS setup
app.set('view engine', 'ejs');

// Serve the landing page
app.get('/', (req, res) => {
  res.render('landing', { success: false, error: false });
});

// Route to handle email submissions
app.post('/submit-email', (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.render('landing', { success: false, error: 'Invalid email address' });
  }

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender email (your Hover email)
    to: 'contact@eastcoasthobbyventures.com', // Your receiving email
    subject: 'New Interested User Submission',
    text: `You have a new email subscriber: ${email}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
      return res.render('landing', { success: false, error: 'Failed to send email. Please try again.' });
    }
    console.log('Email sent:', info.response);
    res.render('landing', { success: true, error: false });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
