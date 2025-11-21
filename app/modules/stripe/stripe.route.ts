import { Router } from "express";
import { createCheckoutSession, fetchStripeSession } from "./stripe.controller";

const router = Router();

router.post("/create-payment-intent", createCheckoutSession);
router.get("/session/:id" , fetchStripeSession)

export default router;
