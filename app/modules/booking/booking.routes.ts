import { Router } from "express";
import { bookSeats } from "./booking.controller";
import { auth } from "../../common/middleware/auth.middleware";
import { bookingLimiter } from "../../common/middleware/ratelimiter.middleware";

const router = Router();

router.post("/:eventId/book", auth, bookingLimiter, bookSeats);

export default router;
