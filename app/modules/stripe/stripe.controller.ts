import { stripe } from "../../common/services/stripe.service";
import type { Request, Response } from "express";
import { getStripeSession } from "./stripe.service";
import asyncHandler from "express-async-handler";
import * as stripeService from "./stripe.service";
import { createResponse } from "../../common/helper/response.helper";
import { EventService } from "../events/event.service";
import * as bookingService from "../booking/booking.service";
import createHttpError from "http-errors";

export const createCheckoutSession = asyncHandler(
async (req: Request, res: Response) => {
console.log("Request body for session:", req.body);
const result = await stripeService.createSeesstion(req.body);
console.log("-------- Backend response for payment:", result);
res.send(createResponse(result, "Payment successful."));
}
);

export const fetchStripeSession = asyncHandler(
async (req: Request, res: Response) => {
const { id } = req.params;
const session = await getStripeSession(id);
res.send(createResponse(session, "Fetched session successfully."));
}
);

export const stripeWebhookHandler = 
async (req: Request, res: Response) => {
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
  throw createHttpError(400, `Webhook Error: ${error.message}`);
}

if (event.type === "checkout.session.completed") {
  const session: any = event.data.object;

  console.log("⭐ Stripe Session Received:", session.id);

  if (!session?.metadata) {
    console.error("❌ Metadata missing from session");
    throw createHttpError(400, "Metadata is missing.");
  }

  // Extract metadata
  const eventId = session.metadata.eventId;
  const seatIds: string[] = JSON.parse(session.metadata.seatIds);
  const userId = session.metadata.userId;
  const amount = session.amount_total / 100;

  console.log("📌 Metadata:", { eventId, seatIds, userId });
  console.log("🎉 Payment successful for session:", session.id);

  // STEP 1: Update seats using webhook-specific service
  try {
    const updatedEvent = await EventService.updateSeatsFromWebhook(
      eventId,
      seatIds,
      userId
    );
    console.log("✅ Seats Updated Successfully:", updatedEvent);
  } catch (err) {
    console.error("❌ Seat update failed:", err);
  }

  // STEP 2: Finalize booking
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

return res.send(createResponse({ received: true }, "Success"));

}

