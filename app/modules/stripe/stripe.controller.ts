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


export const stripeWebhookHandler = async (req: Request, res: Response) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"]!;
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("❌ Webhook signature error", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    if(!session) throw createHttpError(400 , "session not found...")
    if(!session.metadata) throw createHttpError(400 , "session.meta not found..")

    // pull metadata values
    const eventId = session.metadata.eventId;
    const seatIds = JSON.parse(session.metadata.seatIds);
    const userId = session.metadata.userId;

    // Stripe sends amount in cents (paise)
    const amount = session.amount_total / 100;

    console.log("🎉 Payment successful for session:", session.id);

    // 1️⃣ Mark seats booked
    await EventService.updateEvent(
      { _id: eventId },
      {
        $set: {
          "seats.$[elem].status": "booked",
          "seats.$[elem].reservedBy": null,
          "seats.$[elem].reservedAt": null,
        },
      },
      {
        arrayFilters: [{ "elem.seatId": { $in: seatIds } }],
      }
    );

    // 2️⃣ Create booking properly
   const res =   await bookingService.finalizeBooking(
      eventId,
      seatIds,
      amount,
      "paid",
      session.id ,
      userId 
    );

    console.log("✔ Booking finalized successfully.");
    console.log("checking the boooking status .." , res);
  }


  res.json({ received: true });
};
