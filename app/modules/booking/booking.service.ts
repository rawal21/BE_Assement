import { Event } from "../events/event.schema";
import { Booking } from "./booking.schema";
import QRCode from "qrcode";
import { sendEmail } from "../../utils/email";
import { ticketConfirmationTemplate } from "../../utils/emailTemplates";
import { User } from "../auth/auth.schema";
import { generateVerificationQR } from "../../utils/generateQr";

export const finalizeBooking = async (

eventId: string, seatIds: string[], amount: number,  paymentStatus: string,  stripeSessionId: string , userId : string

) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  // Mark seats as booked
  seatIds.forEach((seatId) => {
    const seat = event.seatStatus.find((s) => s.seatNumber === seatId);
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
    amount ,
    paymentStatus ,
    stripeSessionId
  });
  
  console.log("testing the booking serivce how it will handle the seens" , booking)
const verificationUrl = `http://192.168.1.110:8080/api/ticket/validate/${booking._id}`;
const qrBuffer = await generateVerificationQR(verificationUrl);

booking.qrCode = qrBuffer.toString("base64");
await booking.save();

console.log("booking is hitting after the payment success.." , booking);

  // Email
  const user = await User.findById(userId);
  if(!user) return ;
  console.log("user in email verification" , user);
  const html = ticketConfirmationTemplate(
  
    user.name,
    event.title,
    seatIds
  );

  await sendEmail(
    user.email  ,
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
   
  
   const res = await Booking.find({userId : id})
   console.log("the res debbuging in service" , res);
  return res;
}

export const fetchSingleBooking = async (id : string)=>{
  return await Booking.findById(id)

}
