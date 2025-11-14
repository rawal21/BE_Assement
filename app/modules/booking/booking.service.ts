import { Event } from "../events/event.schema";
import { Booking } from "./booking.schema";
import QRCode from "qrcode";
import { sendEmail } from "../../utils/email";
import { ticketConfirmationTemplate } from "../../utils/emailTemplates";
import { User } from "../auth/auth.schema";

export const bookSeats = async (
  eventId: string,
  seatIds: string[],
  userId: string
) => {
  const event = await Event.findById(eventId)
  if (!event) throw new Error("Event not found");

  let totalAmount = 0;
  const now = new Date();

  // VALIDATE + auto-reserve seats
  for (const seatId of seatIds) {
    const seat = event.seats.find((s) => s.seatId === seatId);
    if (!seat) throw new Error(`Seat ${seatId} not found`);

    if (seat.status === "booked") {
      throw new Error(`Seat ${seatId} is already booked`);
    }

    if (seat.status === "reserved" && seat.reservedBy !== userId) {
      throw new Error(`Seat ${seatId} is reserved by another user`);
    }

    if (seat.status === "available") {
      seat.status = "reserved";
      seat.reservedBy = userId;
      seat.reservedAt = new Date();
    }

    if (seat.status === "reserved" && seat.reservedBy === userId) {
      const diff = now.getTime() - seat.reservedAt!.getTime();
      if (diff > 10 * 60 * 1000) {
        seat.reservedAt = new Date();
      }
    }

    totalAmount += seat.price;
  }

  // FETCH USER
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // VALIDATE WALLET
  if (user.wallet < totalAmount) {
    throw new Error(
      `Insufficient wallet balance. Required: ${totalAmount}, Available: ${user.wallet}`
    );
  }

  // DEDUCT MONEY
  user.wallet -= totalAmount;
  await user.save();

  // FINAL BOOKING PROCESS
  seatIds.forEach((seatId) => {
    const seat = event.seats.find((s) => s.seatId === seatId)!;
    seat.status = "booked";
    seat.reservedAt = null;
    seat.reservedBy = null;
  });

  event.markModified("seats");
  await event.save();

  // CREATE BOOKING
  const booking = await Booking.create({
    userId,
    eventId,
    seats: seatIds,
    amount: totalAmount,
  });

  // GENERATE QR (BUFFER FOR EMAIL)
  const qrBuffer = await QRCode.toBuffer(booking._id.toString());

  // SAVE BASE64 IN DB (optional)
  booking.qrCode = qrBuffer.toString("base64");
  await booking.save();

  // EMAIL HTML (CID BASED)
  const emailHTML = ticketConfirmationTemplate(
    user.name,
    event.title,
    seatIds
  );

  // SEND EMAIL WITH ATTACHMENT
  await sendEmail(
    user.email,
    `Your Ticket for ${event.title}`,
    emailHTML,
    [
      {
        filename: "ticket-qr.png" ,
        content: qrBuffer,
        cid: "qrCodeImage", // MUST MATCH template
      },
    ]
  );

  return booking;
};
