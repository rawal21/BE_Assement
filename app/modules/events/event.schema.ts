import mongoose from "mongoose";
import { IEvent } from "./event.dto";

const schema = mongoose.Schema;

// 1️⃣ Seat layout belongs to venue (fixed seat definitions)
const venueSeatSchema = new schema({
  seatNumber: { type: String, required: true }, // e.g A1, B4, G10
  category: { type: String, default: "regular" }, 
  basePrice: { type: Number, required: true },
});

// 2️⃣ Actual seat status for THIS event
const eventSeatStatusSchema = new schema({
  seatNumber: { type: String, required: true },
  status: {
    type: String,
    enum: ["available", "reserved", "booked"],
    default: "available",
  },
  price: { type: Number, required: true },
  reservedBy: { type: String, default: null },
  reservedAt: { type: Date, default: null },
});

// 3️⃣ Event Schema
const eventSchema = new schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    // ⭐ venue includes seat layout
    venue: {
      name: { type: String, required: true },
      address: { type: String, required: true },

      seats: [venueSeatSchema], // <- fixed seat layout per venue
    },

    
    seatStatus: [eventSeatStatusSchema],

    startAt: { type: Date, required: true },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    image: {
      public_id: { type: String },
      url: { type: String },
    },
  },
  { timestamps: true }
);

// Virtuals
eventSchema.virtual("totalSeats").get(function () {
  return this.venue?.seats?.length || 0;
});

eventSchema.virtual("availableSeats").get(function () {
  return this.seatStatus?.filter((s) => s.status === "available").length || 0;
});

eventSchema.virtual("reservedSeats").get(function () {
  return this.seatStatus?.filter((s) => s.status === "reserved").length || 0;
});

eventSchema.virtual("bookedSeats").get(function () {
  return this.seatStatus?.filter((s) => s.status === "booked").length || 0;
});

eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

export const Event = mongoose.model<IEvent>("Event", eventSchema);
