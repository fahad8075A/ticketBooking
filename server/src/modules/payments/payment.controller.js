import * as paymentService from './payment.service.js';

export const initializePayment = async (req, res) => {
  try {
    const { bookingId, amount, currency } = req.body;

    if (!bookingId || amount === undefined || amount === null) {
      return res.status(400).json({
        success: false,
        message: 'bookingId and amount are required',
      });
    }

    const data = await paymentService.createPaymentIntent({
      bookingId,
      amount,
      currency,
    });

    return res.status(201).json({ success: true, data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'paymentIntentId is required',
      });
    }

    const payment = await paymentService.verifyPayment(paymentIntentId);

    return res.status(200).json({ success: true, data: payment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const payment = await paymentService.getPaymentByBooking(bookingId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found for this booking',
      });
    }

    return res.status(200).json({ success: true, data: payment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};