import { Router } from "express";
import authRoutes from "./modules/auth/auth.route";
import eventRoutes from "./modules/events/event.route";
import bookingRoutes from "./modules/booking/booking.routes";
import ticketRoutes from "./modules/ticket/ticket.routes";
import paymentRoutes from "./modules/stripe/stripe.route"
// import webhookRoutes from "./modules/stripe/stripe.webhook.route"
const router = Router();

router.use("/auth", authRoutes);
router.use("/event", eventRoutes);
router.use("/booking", bookingRoutes);
router.use("/ticket", ticketRoutes);
router.use("/payment" , paymentRoutes);
// router.use("/webhook" , webhookRoutes)
export default router;
