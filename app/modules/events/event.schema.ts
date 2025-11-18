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
    image: {
  public_id: { type: String, required: false },
  url: { type: String, required: false }
},

  },
  { timestamps: true 

  }
);


// ⭐ Virtuals
eventSchema.virtual("totalSeats").get(function () {
  return this.seats.length;
});

eventSchema.virtual("availableSeats").get(function () {
  return this.seats.filter((s) => s.status === "available").length;
});

eventSchema.virtual("reservedSeats").get(function () {
  return this.seats.filter((s) => s.status === "reserved").length;
});

eventSchema.virtual("bookedSeats").get(function () {
  return this.seats.filter((s) => s.status === "booked").length;
});

// ⭐ Enable virtuals in response JSON
eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

export const Event = mongoose.model<IEvent>("Event", eventSchema);

