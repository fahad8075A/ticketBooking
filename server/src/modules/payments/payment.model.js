import mongoose from 'express'; // or 'mongoose'
import { Schema, model } from 'mongoose';

const paymentSchema = new Schema(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true,
    },
    paymentIntentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'inr',
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'succeeded', 'completed', 'canceled', 'failed'],
      default: 'pending',
    },
    paymentMethodId: {
      type: String,
      default: null,
    },
    rawResponse: {
      type: Object,
      default: null,
    },
  },
  { timestamps: true }
);

export default model('Payment', paymentSchema);