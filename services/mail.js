const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
require('dotenv').config();
app.use(express.json());

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Endpoint to send an email
async function sendMail (mailOptions) {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = {
    sendMail,
  };

