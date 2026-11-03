import nodemailer from 'nodemailer';
import 'dotenv'


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for port 465, false for 587
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS  // Your email App Password
    }
});

export const sendVerificationEmail = async (toEmail, code) => {
    const mailOptions = {
        from: `"Joblify Team" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Joblify - Your Email Verification Code',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2>Welcome to Joblify!</h2>
                <p>Use the following 6-digit code to complete your verification:</p>
                <h1 style="background: #f4f4f4; padding: 10px; display: inline-block; letter-spacing: 4px; color: #007bff;">${code}</h1>
                <p>This code will expire in <strong>10 minutes</strong>.</p>
                <p>If you did not request this code, please ignore this email.</p>
            </div>
        `
    };

    return await transporter.sendMail(mailOptions);
};