// backend/routes/stripe.webhook.ts
import express from "express";
import bodyParser from "body-parser";
import { stripe } from "../../common/services/stripe.service";
import { finalizeBooking } from "../booking/booking.service";
import { Types } from "mongoose";

const router = express.Router();

router.post(
  "/stripe",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    console.log("are we hitting on stripe hook")
    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if(!session) throw new Error("session not found..");
      if(!session.metadata) throw new Error("meta data not found")
      if(!session.amount_total) return 
      console.log("are we hitting the session on backend in webhoook" , session)

      const eventId = session.metadata.eventId;
      const seatIds = JSON.parse(session.metadata.seatIds);
      const userId = session.metadata.userId;
      const amount = session.amount_total / 100;


   
     
    }

    res.json({ received: true });
  }
);

export default router;
