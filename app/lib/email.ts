import nodemailer from 'nodemailer';

// Method 1: Simple Gmail configuration (Recommended)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Use App Password, not regular password
  },
});



// Test connection
transporter.verify(function(error, success) {
  if (error) {
    console.log("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server is ready to send messages");
  }
});

// Keep your sendPasswordResetEmail function as is
export async function sendPasswordResetEmail(to: string, resetLink: string) {
  console.log("Attempting to send email to:", to);
  console.log("Reset link:", resetLink);
  
  try {
    const mailOptions = {
      from: `"Kissan Partner" <${process.env.EMAIL_USER}>`, // Better format
      to,
      subject: 'Reset Your Admin Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested to reset your password for the Admin Portal.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}" 
             style="display: inline-block; padding: 12px 24px; background-color: #059669; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Reset Password
          </a>
          
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #888; font-size: 12px;">
            © ${new Date().getFullYear()} Kissan Partner. All rights reserved.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}