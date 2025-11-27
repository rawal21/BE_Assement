// Seat layout inside venue
import { Types } from "mongoose";
export interface IVenueSeat {
  seatNumber: string;
  category?: string;
  basePrice: number;
}

// Seat status for each event
export interface IEventSeatStatus {
  seatNumber: string;
  price: number;
  status: "available" | "reserved" | "booked";
  reservedBy: string | null;
  reservedAt: Date | null;
}

// Main Event Interface
export interface IEvent {
  title: string;
  description: string;

  venue: {
    name: string;
    address: string;
    seats: IVenueSeat[];
  };

  seatStatus: IEventSeatStatus[];

  startAt: Date;

  createdBy: Types.ObjectId;

  image?: {
    public_id: string;
    url: string;
  };
}