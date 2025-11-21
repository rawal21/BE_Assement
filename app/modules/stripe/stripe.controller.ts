import { stripe } from "../../common/services/stripe.service";
import type { Request, Response } from "express";
import { getStripeSession } from "./stripe.service";
export const createCheckoutSession = async (req: Request, res: Response) => {
try {
const { amount, eventId, seatIds, userId } = req.body;


const session = await stripe.checkout.sessions.create({
  mode: "payment",
  payment_method_types: ["card"], // ✅ added UPI along with card
  line_items: [
    {
      price_data: {
        currency: "inr",
        unit_amount: amount * 100, // convert to paisa
        product_data: {
          name: "Event Booking",
        },
      },
      quantity: 1,
    },
  ],
success_url: `${process.env.FRONTEND_URL}/booking/`,
  cancel_url: "http://localhost:3000/cancel",
  metadata: {
    eventId,
    seatIds: JSON.stringify(seatIds),
    userId,
  },
});

res.json({
  success: true,
  url: session.url,
});


} catch (err: any) {
console.error(err);
res.status(500).json({ success: false, message: err.message });
}
};

export const fetchStripeSession = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const session = await getStripeSession(id);
    res.json(session);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
