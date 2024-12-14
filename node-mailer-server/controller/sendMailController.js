const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs').promises; // Using promises version of fs for async operations
const path = require('path');
require('dotenv').config();

// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Destination folder for file uploads
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // File naming strategy
    }
});

const upload = multer({ storage: storage });

// Function to send email
const sendMail = async (req, res) => {
    const { to, subject, text, html } = req.body;
    const attachments = req.files; // Array of uploaded files

    try {
        // Create Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Example: Gmail service
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // Secure connection false for TLS
            auth: {
                user: 'sivahere9484@gmail.com', // Your email username from .env
                pass: process.env.PASSWORD // Your email password from .env
            }
        });

        // Email options
        const mailOptions = {
            from: {
                name: "s1v4h3r3", // Sender's name
                address: 'sivahere9484@gmail.com' // Sender's email address
            },
            to: to.split(',').map(email => email.trim()), // Convert comma-separated emails to array
            subject: subject, // Subject line
            text: text, // Plain text body
            html: html, // HTML body
            attachments: attachments.map(att => ({
                filename: att.originalname, // Original filename
                path: att.path // File path on server (already uploaded by Multer)
            }))
        };

        // Send mail with defined transport object
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);

        // Delete uploaded files after sending email
        await Promise.all(attachments.map(att => fs.unlink(att.path)));
        // Asynchronously delete files

        // Introduce a delay to ensure files are deleted before responding
        setTimeout(() => {
            res.status(200).json({ message: 'Email sent successfully', info });
        }, 1000); // Adjust delay time as needed
    } catch (error) {
        console.error("Error sending email:", error);
        // Send error response
        res.status(500).json({ error: 'Failed to send email' });
    }
};

module.exports = [upload.array('attachments'), sendMail];

// const nodemailer = require('nodemailer');
// require('dotenv').config();

// const sendMail = async (req, res) => {
//     console.log(req.body);
//     const { to, subject, text } = req.body;

//     try {
//         // Create Nodemailer transporter
//         const transporter = nodemailer.createTransport({
//             service: 'gmail', // Example: Gmail service
//             host: 'smtp.gmail.com',
//             port: 587,
//             secure: false, // Secure connection false for TLS
//             auth: {
//                 user: 'sivahere9484@gmail.com', // Your email username from .env
//                 pass: process.env.PASSWORD // Your email password from .env
//             }
//         });

//         // Email options
//         const mailOptions = {
//             from: {
//                 name: "s1v4h3r3", // Sender's name
//                 address: 'sivahere9484@gmail.com' // Sender's email address
//             },
//             to: 'sivahere9484@gmail.com', // Already an array of emails
//             subject: 'Hi', // Subject line
//             text: 'Hello' // Plain text body
//         };

//         // Send mail with defined transport object
//         console.log(mailOptions)
//         const info = await transporter.sendMail(mailOptions);
//         console.log("Message sent: %s", info.messageId);

//         res.status(200).json({ message: 'Email sent successfully', info });
//     } catch (error) {
//         console.error("Error sending email:", error);
//         // Send error response
//         res.status(500).json({ error: 'Failed to send email' });
//     }
// };

// module.exports = sendMail;
