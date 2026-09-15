import Stripe from 'stripe';
import Payment from './payment.model.js'; // Adjust path if your models folder is elsewhere
// import Booking from '../booking/booking.model.js'; // Optional: import if updating booking doc directly

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Creates a Stripe PaymentIntent and logs an initial payment record in DB.
 */
export const createPaymentIntent = async ({ bookingId, amount, currency = 'inr' }) => {
  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    throw new Error('Valid positive amount is required');
  }

  // Convert to smallest currency unit (e.g., INR paise, USD cents)
  const subunitAmount = Math.round(numericAmount * 100);

  // 1. Create intent on Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: subunitAmount,
    currency: currency.toLowerCase(),
    automatic_payment_methods: { enabled: true },
    metadata: {
      bookingId: String(bookingId),
    },
  });

  // 2. Persist initial payment intent record in MongoDB
  const payment = await Payment.findOneAndUpdate(
    { bookingId },
    {
      bookingId,
      paymentIntentId: paymentIntent.id,
      amount: numericAmount,
      currency: currency.toLowerCase(),
      status: 'pending',
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    paymentId: payment._id,
    amount: numericAmount,
    currency: paymentIntent.currency,
  };
};

/**
 * Retrieves the PaymentIntent from Stripe and updates the local DB record.
 */
export const verifyPayment = async (paymentIntentId) => {
  // 1. Retrieve the authoritative state from Stripe directly
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (!paymentIntent) {
    throw new Error('Payment Intent not found on Stripe');
  }

  // Map Stripe status to application status
  const isSuccessful = paymentIntent.status === 'succeeded';
  const updatedStatus = isSuccessful ? 'completed' : paymentIntent.status;

  // 2. Update local payment record
  const payment = await Payment.findOneAndUpdate(
    { paymentIntentId },
    {
      status: updatedStatus,
      paymentMethodId: paymentIntent.payment_method || null,
      rawResponse: paymentIntent,
    },
    { new: true }
  );

  if (!payment) {
    throw new Error('Local payment record not found for this intent');
  }

  // Optional: If you update your Booking document status directly here:
  // if (isSuccessful && payment.bookingId) {
  //   await Booking.findByIdAndUpdate(payment.bookingId, { status: 'confirmed' });
  // }

  return {
    paymentId: payment._id,
    bookingId: payment.bookingId,
    status: payment.status,
    stripeStatus: paymentIntent.status,
    amount: payment.amount,
    currency: payment.currency,
    isPaid: isSuccessful,
  };
};

/**
 * Fetches the latest payment record associated with a specific booking.
 */
export const getPaymentByBooking = async (bookingId) => {
  const payment = await Payment.findOne({ bookingId }).sort({ createdAt: -1 });
  return payment;
};