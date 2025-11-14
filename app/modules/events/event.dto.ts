import { Types } from "mongoose";


export interface ISeat {
  seatId: string;
  price: number;
  status: "available" | "reserved" | "booked";
  reservedBy: string | null;
  reservedAt: Date | null;
}

export interface IEvent extends ISeat {
  title: string;
  description: string;
  venue: string;
  startAt: Date;
  createdBy: Types.ObjectId;
  seats: ISeat[];
}
