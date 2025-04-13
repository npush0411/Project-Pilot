const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, message) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // or Mailgun, SES, etc.
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for StudyNotion',
            text: message,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (err) {
        console.error('Failed to send verification email:', err);
        throw err;
    }
};

module.exports = sendVerificationEmail;
