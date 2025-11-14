import { Router } from "express";
import { validateTicket } from "./ticket.controller";
import { auth } from "../../common/middleware/auth.middleware";

const router = Router();

router.post("/validate", auth , validateTicket);

export default router;
