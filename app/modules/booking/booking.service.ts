import { Event } from "../events/event.schema";
import { Booking } from "./booking.schema";
import QRCode from "qrcode";
import { sendEmail } from "../../utils/email";
import { ticketConfirmationTemplate } from "../../utils/emailTemplates";
import { User } from "../auth/auth.schema";

export const finalizeBooking = async (
  eventId: string,
  seatIds: string[],
  userId: string,
  amount: number
) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  // Mark seats as booked
  seatIds.forEach((seatId) => {
    const seat = event.seats.find((s) => s.seatId === seatId);
    if (seat) {
      seat.status = "booked";
      seat.reservedBy = null;
      seat.reservedAt = null;
    }
  });

  event.markModified("seats");
  await event.save();

  // Create booking record
  const booking = await Booking.create({
    userId,
    eventId,
    seats: seatIds,
    amount
  });

  const qrBuffer = await QRCode.toBuffer(booking._id.toString());
  booking.qrCode = qrBuffer.toString("base64");
  await booking.save();

  // Email
  const user = await User.findById(userId);
  const html = ticketConfirmationTemplate(
    user.name,
    event.title,
    seatIds
  );

  await sendEmail(
    user.email,
    `Your Ticket for ${event.title}`,
    html,
    [
      {
        filename: "ticket-qr.png",
        content: qrBuffer,
        cid: "qrCodeImage",
      },
    ]
  );

  return booking;
};

export const fetchAllbooking = async (id : string)=>{
    return  await Booking.find({userId : id})
  
}

export const fetchSingleBooking = async (id : string)=>{
  return await Booking.findById(id)

}
