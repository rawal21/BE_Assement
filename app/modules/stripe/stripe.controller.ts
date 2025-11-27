import { stripe } from "../../common/services/stripe.service";
import type { Request, Response } from "express";
import { getStripeSession } from "./stripe.service";
import asyncHandler from "express-async-handler";
import * as stripeService from "./stripe.service";
import { createResponse } from "../../common/helper/response.helper";
import { EventService } from "../events/event.service";
import * as bookingService from "../booking/booking.service";
import createHttpError from "http-errors"

export const createCheckoutSession = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("requests bodys for session " , req.body);
    const result = await stripeService.createSeesstion(req.body);
    console.log("-------- backend res for payment" , result);
    res.send(createResponse(result, "payment sucesss."));
  }
);

export const fetchStripeSession = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const session = await getStripeSession(id);
    res.send(createResponse(session, "fetch session.."));
  }
);


export const stripeWebhookHandler = asyncHandler(async (req: Request, res: Response) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"]!;
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("❌ Stripe Signature Verification Failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // 👉 STEP 1: CHECK EVENT TYPE
  if (event.type === "checkout.session.completed") {
    const session: any = event.data.object;

    console.log("⭐ Stripe Session Received:", session.id);

    if (!session?.metadata) {
      console.error("❌ Metadata missing from session");
      return res.status(400).json({ message: "Metadata missing" });
    }

    // 👉 STEP 2: Extract Metadata
    const eventId = session.metadata.eventId;
    const seatIds = JSON.parse(session.metadata.seatIds); // array of seat ids
    const userId = session.metadata.userId;
    const amount = session.amount_total / 100;

    console.log("📌 Metadata:", { eventId, seatIds, userId });
    console.log("🎉 Payment successful for session:", session.id);

    // 👉 STEP 3: Update Seats (with arrayFilters)
    try {
      const updatedEvent = await EventService.updateEvent(
        { _id: eventId },
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

      console.log("✅ Seats Updated Successfully:", updatedEvent);
    } catch (err) {
      console.error("❌ Seat update failed:", err);
    }

    // 👉 STEP 4: Finalize Booking (RENAMED — no conflict with res)
    try {
      const booking = await bookingService.finalizeBooking(
        eventId,
        seatIds,
        amount,
        "paid",
        session.id,
        userId
      );

      console.log("✔ Booking finalized successfully.");
      console.log("📘 Booking:", booking);
    } catch (err) {
      console.error("❌ Booking creation failed:", err);
    }
  }

  // 👉 MUST RESPOND TO STRIPE QUICKLY
  return res.json({ received: true });
});

