import { stripe } from "../../common/services/stripe.service";
import type { Request , Response } from "express";
export const createPaymentIntent = async (req : Request, res : Response) => {
  try {
    const { amount, eventId, seatIds, userId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // INR in paisa
      currency: "inr",
      metadata: {
        eventId,
        seatIds: JSON.stringify(seatIds),
        userId
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });

  } catch (err : any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
