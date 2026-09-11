import Stripe from 'stripe';
import Payment from './payment.model.js';
import { Booking } from '../bookings/booking.model.js';
import dotenv from 'dotenv'



dotenv.config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
 

export const createPaymentIntent = async ({ bookingId, amount, currency = 'usd' }) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error('Booking not found');
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata: {
      bookingId: bookingId.toString(),
    },
  });

  const paymentRecord = await Payment.create({
    bookingId,
    amount,
    currency,
    paymentIntentId: paymentIntent.id,
    status: 'pending',
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentId: paymentRecord._id,
  };
};

export const verifyPayment = async (paymentIntentId) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  const payment = await Payment.findOne({ paymentIntentId });

  if (!payment) {
    throw new Error('Payment record not found');
  }

  if (paymentIntent.status === 'succeeded') {
    payment.status = 'succeeded';
    await payment.save();
    await Booking.findByIdAndUpdate(payment.bookingId, { status: 'confirmed' });
  } else if (['requires_payment_method', 'canceled'].includes(paymentIntent.status)) {
    payment.status = 'failed';
    await payment.save();
  }

  return payment;
};

export const getPaymentByBooking = async (bookingId) => {
  return await Payment.findOne({ bookingId }).populate('bookingId');
};