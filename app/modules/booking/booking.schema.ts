import mongoose from "mongoose";
const schema = mongoose.Schema;

const bookingSchema = new schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    seats: [{ type: String, required: true }],

    amount: { type: Number, required: true },

    qrCode: { type: String },

    status: {
      type: String,
      enum: ["booked", "used"],
      default: "booked",
    },

    // ⭐ Payment Fields
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    stripeSessionId: { type: String },


  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
