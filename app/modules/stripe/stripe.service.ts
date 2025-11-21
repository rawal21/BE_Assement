// backend/services/stripe.service.ts
import { stripe } from "../../common/services/stripe.service";

export const getStripeSession = async (sessionId: string) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    throw error;
  }
};
