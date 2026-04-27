const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTPEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"Yadav Parivar" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Verification Link - Yadav Parivar Vault',
    html: `
      <div style="font-family: 'Times New Roman', serif; max-width: 600px; margin: 0 auto; padding: 40px; text-align: center; background: #0a0514; border: 2px solid #f5a623; border-radius: 24px; color: #ffffff;">
        <div style="font-size: 64px; color: #f5d020; margin-bottom: 20px;">ॐ</div>
        <h1 style="color: #f5a623; font-family: serif; font-size: 28px; margin-bottom: 24px; letter-spacing: 2px; text-transform: uppercase;">Sanctity Verification</h1>
        <p style="font-size: 18px; line-height: 1.6; color: rgba(255,255,255,0.8); margin-bottom: 32px;">
          Welcome to the digital lineage of the <b>Yadav Parivar</b>. <br/>
          To finalize your entry into the vault, please utilize the following sacred code:
        </p>
        <div style="font-size: 42px; font-weight: 800; padding: 24px; margin: 32px 0; background: rgba(245,166,35,0.1); color: #f5d020; border: 1px solid rgba(245,166,35,0.5); border-radius: 16px; letter-spacing: 8px; width: max-content; margin-left: auto; margin-right: auto;">
          ${otp}
        </div>
        <p style="color: rgba(255,255,255,0.4); font-size: 14px; line-height: 1.5;">
          This link will expire in <b style="color: #f5a623;">10 minutes</b>. <br/>
          If you did not initiate this request, the sanctity has not been compromised; simply disregard this broadcast.
        </p>
        <div style="margin-top: 48px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px;">
          <p style="font-size: 12px; color: rgba(255,255,255,0.3); letter-spacing: 1px;">© 2024 Yadav Parivar • Digital Heritage Profile</p>
        </div>
      </div>
    `
  };

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('WARNING: EMAIL_USER or EMAIL_PASS not set. Skipping real email send.');
      console.log(`Mock Email sent to ${toEmail} with OTP: ${otp}`);
      return true;
    }
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendOTPEmail };

