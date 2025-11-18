import { ISeat } from "./event.dto";
import { Event } from "./event.schema";
import cloudinary from "../../common/helper/cloundnaryConfig.helper";
import fs from 'fs';


interface AddSeatDto {
  seatId: string;
  price: number;
}

export const EventService = {
  createEvent: async (data: any , userId : string , file? : Express.Multer.File) => {
    let uploadResult = null ;

    if(file)
    {
      uploadResult = await cloudinary.uploader.upload(file.path , {
        folder : "events"
      });
    }

    const event = await Event.create({
      ...data,
      createdBy: userId,
      image: uploadResult
        ? {
            public_id: uploadResult.public_id,
            url: uploadResult.secure_url,
          }
        : null,
    });

    return event;
  },

  getEvents: async () => {
    return await Event.find();
  },

  getEventById: async (id: string) => {
    const event = await Event.findById(id);
    if (!event) throw new Error("Event not found");
    return event;
  },

  updateEvent: async (id: string, data: any) => {
    const event = await Event.findByIdAndUpdate(id, data, { new: true });
    if (!event) throw new Error("Event not found");
    return event;
  },

  addSeatsEvent: async (eventId: string, seats: AddSeatDto[]) => {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    seats.forEach((seat) => {
      event.seats.push({
        seatId: seat.seatId,
        price: seat.price,
        status: "available",
        reservedBy: null,
        reservedAt: null,
      });
    });

    await event.save();
    return event;
  },

  reserveSeats: async (
  eventId: string,
  seatIds: string[],
  userId: string
) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");
  const now = new Date();

  const reservedSeats: any[] = [];

  seatIds.forEach((seatId) => {
    const seat = event.seats.find((s) => s.seatId === seatId);

    if (!seat) throw new Error(`Seat ${seatId} not found`);

    if (seat.status !== "available")
      throw new Error(`Seat ${seatId} is already ${seat.status}`);

    seat.status = "reserved";
    seat.reservedBy = userId;
    seat.reservedAt = now;

    reservedSeats.push(seat);  // ⬅ store only reserved seats
  });

  await event.save();

  return reservedSeats;  // ⬅ return only the selected reserved seats
},
}