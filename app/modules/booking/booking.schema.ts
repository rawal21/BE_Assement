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
    seats: [
      { type: String, required: true }, // seatIds only
    ],
    amount: { type: Number, required: true },
    qrCode: { type: String },
    status: {
      type: String,
      enum: ["booked", "used"],
      default: "booked",
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
