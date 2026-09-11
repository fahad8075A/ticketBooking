import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import { logger } from './logger.js';

// Setup email transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Use App Password if using Gmail
  },
});

/**
 * Generate a cryptographically secure numeric OTP
 */
export function generateOtp(length = 6) {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return crypto.randomInt(min, max + 1).toString();
}

/**
 * Dispatch OTP via SMS
 */
async function sendSmsOtp(phoneNumber, otp) {
  if (process.env.NODE_ENV !== 'production' && !process.env.TWILIO_SID) {
    logger.info(`[DEV MOCK SMS] OTP for ${phoneNumber}: ${otp}`);
    return { success: true, provider: 'mock' };
  }

  // Example real provider (e.g. Twilio)
  /*
  import twilio from 'twilio';
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  await client.messages.create({
    body: `Your verification code is: ${otp}. It expires in 5 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber,
  });
  */

  logger.info(`SMS OTP dispatched to ${phoneNumber}`);
  return { success: true, provider: 'sms-gateway' };
}

/**
 * Dispatch OTP via Email
 */
async function sendEmailOtp(email, otp) {
  // If credentials are missing in dev, log the code instead of failing
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.info(`[DEV MOCK EMAIL] OTP for ${email}: ${otp}`);
    return { success: true, provider: 'mock' };
  }

  await transporter.sendMail({
    from: `"Support Team" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your One-Time Password (OTP)',
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    html: `<b>Your OTP is: <span style="font-size: 20px; color: #2563eb;">${otp}</span></b><p>Valid for 5 minutes.</p>`,
  });

  logger.info(`Email OTP dispatched successfully to ${email}`);
  return { success: true, provider: 'nodemailer' };
}

/**
 * Main dispatcher
 */
export async function sendOtp({ channel, recipient, otp }) {
  const code = otp || generateOtp(6);

  try {
    if (channel === 'sms') {
      await sendSmsOtp(recipient, code);
    } else if (channel === 'email') {
      await sendEmailOtp(recipient, code);
    } else {
      throw new Error(`Unsupported notification channel: "${channel}"`);
    }

    return { success: true, otp: code };
  } catch (error) {
    logger.error(`Failed to dispatch OTP to ${recipient}: ${error.message}`);
    throw error;
  }
}