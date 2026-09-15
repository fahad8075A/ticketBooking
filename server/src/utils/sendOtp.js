import nodemailer from 'nodemailer';

const logger = console;

export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if email credentials exist in .env
    const hasEmailConfig = process.env.EMAIL_USER && process.env.EMAIL_PASS;

    if (hasEmailConfig) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"FlexiBook" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your FlexiBook Verification Code',
        text: `Your OTP verification code is: ${otp}`,
        html: `<b>Your OTP verification code is: <h2>${otp}</h2></b>`,
      });

      logger.log(`[OTP] Sent email to ${email}`);
    } else {
      // Development mode fallback
      logger.log(`\n============================`);
      logger.log(`[DEV MODE] OTP for ${email}: ${otp}`);
      logger.log(`============================\n`);
    }

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      devOtp: !hasEmailConfig ? otp : undefined,
    });
  } catch (error) {
    logger.error('Error in sendOtp:', error);
    next(error);
  }
};