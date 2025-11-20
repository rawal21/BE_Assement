import express from "express";
import bodyParser from "body-parser";
import { stripe } from "../../common/services/stripe.service";
import { finalizeBooking } from "../booking/booking.service";

const router = express.Router();

router.post(
  "/stripe",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      const eventId = paymentIntent.metadata.eventId;
      const seatIds = JSON.parse(paymentIntent.metadata.seatIds);
      const userId = paymentIntent.metadata.userId;
      const amount = paymentIntent.amount / 100;

      // Finalize the booking
      await finalizeBooking(eventId, seatIds, userId, amount);
    }

    res.json({ received: true });
  }
);

export default router;
