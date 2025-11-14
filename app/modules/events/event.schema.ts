import mongoose from "mongoose";
import { ISeat, IEvent } from "./event.dto";

const schema = mongoose.Schema;

const seatSchema = new schema<ISeat>({
  seatId: { type: String, required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ["available", "reserved", "booked"],
    default: "available",
  },
  reservedBy: { type: String, default: null },
  reservedAt: { type: Date, default: null },
});

const eventSchema = new schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    venue: { type: String, required: true },
    startAt: { type: Date, required: true },

    // ⭐ Correct User Reference
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    seats: [seatSchema],
  },
  { timestamps: true }
);

export const Event = mongoose.model<IEvent>("Event", eventSchema);
