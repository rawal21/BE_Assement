import cron from "node-cron";
import { Event } from "../modules/events/event.schema";

cron.schedule("* * * * *", async () => {
  console.log("⏳ Running seat release job...");

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  const events = await Event.find({
    "seats.status": "reserved",
    "seats.reservedAt": { $lte: tenMinutesAgo } 
  });

  for (const event of events) {
    event.seats.forEach((seat) => {
      if (
        seat.status === "reserved" &&
        seat.reservedAt &&
        seat.reservedAt <= tenMinutesAgo 
      ) {
        seat.status = "available";
        seat.reservedBy = null;
        seat.reservedAt = null;
      }
    });

    await event.save();
  }

  console.log("♻ Released expired reserved seats");
});
