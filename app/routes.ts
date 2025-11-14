import { Router } from "express";
import authRoutes from "./modules/auth/auth.route";
import eventRoutes from "./modules/events/event.route";
import bookingRoutes from "./modules/booking/booking.routes";
import ticketRoutes from "./modules/ticket/ticket.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/event", eventRoutes);
router.use("/booking", bookingRoutes);
router.use("/ticket", ticketRoutes);
export default router;
