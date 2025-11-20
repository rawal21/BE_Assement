import { Router } from "express";
import * as bookingController from "./booking.controller"
import { auth } from "../../common/middleware/auth.middleware";
import { bookingLimiter } from "../../common/middleware/ratelimiter.middleware";

const router = Router();

router.post("/:eventId/book", auth, bookingController.bookSeats);
router.get("/" , auth , bookingController.fetchbooking)

export default router;
