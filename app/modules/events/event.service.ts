import { IEvent} from "./event.dto";
import { Event } from "./event.schema";
import cloudinary from "../../common/helper/cloundnaryConfig.helper";
import fs from "fs";
import createHttpError from 'http-errors';

interface AddSeatDto {
  seatId: string;
  price: number;
  status : "available" | "reserved" | "booked"
}

export const EventService = {
  createEvent: async (
    data: Omit<IEvent , "createdBy" | "image">,
    userId: string,
    file?: Express.Multer.File
  ) => {
    let uploadResult = null;

    if (file) {
      uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "events",
      });

      fs.unlinkSync(file.path);
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

  addimage: async (eventId: string, file?: Express.Multer.File) => {
    let uploadResult = null;
    console.log("are we hitting the upload services..");
    console.log("trying to debug the api_key", process.env.CLOUDINARY_KEY);
    console.log("file deubbgin ", file);
    if (file) {
      uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "events",
      });

      fs.unlinkSync(file.path);
    }

    const event = await Event.findByIdAndUpdate(
      eventId,
      {
        image: uploadResult
          ? {
              public_id: uploadResult.public_id,
              url: uploadResult.secure_url,
            }
          : null,
      },
      { new: true }
    );

    return event;
  },

  getEvents: async () => {
    
    const result = await Event.find();
    console.log("resulting the fetchEvents" , result);
    
    return result ;

  },

  getEventById: async (id: string) => {
    const event = await Event.findById(id);
    if (!event) throw new Error("Event not found");
    return event;
  },

  updateEvent: async ( id: string, data: any) => {
    const event = await Event.findByIdAndUpdate(id, data, { new: true });
    if (!event) throw new Error("Event not found");
    return event;
  },

  reserveSeats: async (eventId: string, seatIds: string[], userId: string) => {
    const event = await Event.findById(eventId);
    if (!event) throw createHttpError("Event not found");
    const now = new Date();

    const reservedSeats: any[] = [];

    seatIds.forEach((seatId) => {
      const seat = event.seatStatus.find((s) => s.seatNumber === seatId);

      if (!seat) throw new Error(`Seat ${seatId} not found`);

      if (seat.status !== "available")
        throw new Error(`Seat ${seatId} is already ${seat.status}`);

      seat.status = "reserved";
      seat.reservedBy = userId;
      seat.reservedAt = now;

      reservedSeats.push(seat); // ⬅ store only reserved seats
    });

    await event.save();

    return reservedSeats; // ⬅ return only the selected reserved seats
  },


  updateSeatsFromWebhook: async (
    eventId: string | any,
    seatIds: string[],
    userId: string
  ) => {
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        $set: {
          "seatStatus.$[elem].status": "booked",
          "seatStatus.$[elem].reservedBy": userId,
          "seatStatus.$[elem].reservedAt": Date.now(),
        },
      },
      {
        arrayFilters: [{ "elem._id": { $in: seatIds } }],
        new: true,
      }
    );

    if (!updatedEvent) throw createHttpError(404, "Event not found");

    return updatedEvent;
  },
};

