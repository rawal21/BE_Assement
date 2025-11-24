// backend/services/stripe.service.ts
import { stripe } from "../../common/services/stripe.service";

interface reqDto {
  amount : number ;
  eventId : string ;
  seatIds : string[];
  userId : string
}


export const createSeesstion = async (data : reqDto)=>{
    const { amount, eventId, seatIds, userId } = data
  const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            unit_amount: amount * 100,
            product_data: { name: "Event Booking" },
          },
          quantity: 1,
        },
      ],

      // ⭐ IMPORTANT — SEND SESSION_ID BACK TO FRONTEND
      success_url: `${process.env.FRONTEND_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/booking/cancel`,

      metadata: {
        eventId,
      seatIds: JSON.stringify(seatIds),
        userId,
        amount,
      },
    });

    return ({ success: true, url: session.url });
}

export const getStripeSession = async (sessionId: string) => {

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;

};

