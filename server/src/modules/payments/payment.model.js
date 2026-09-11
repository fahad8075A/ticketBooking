import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    paymentIntentId: {
      type: String,
      required: true,
      unique: true, // 
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "succeeded", "failed", "refunded"],
      default: "pending",
      
    },
    paymentMethod: {
      type: String,
      default: "stripe",
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;