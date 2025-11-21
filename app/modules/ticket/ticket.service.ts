import { Booking } from "../booking/booking.schema";
import { Event } from "../events/event.schema";

export const validateTicket = async (bookingId: string, eventId: string) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Invalid Ticket — Booking not found");

  // Check event match
  if (!booking.eventId.equals(eventId)) {
  throw new Error("Ticket does not belong to this event");
}


  // Check if already used
  if (booking.status === "used")
    throw new Error("Ticket already used");

  // Mark as used
  booking.status = "used";
  await booking.save();

  // Fetch event info
  const event = await Event.findById(eventId);

  return {
    message: "Ticket is valid",
    booking,
    event,
    valid : true 
  };
};
