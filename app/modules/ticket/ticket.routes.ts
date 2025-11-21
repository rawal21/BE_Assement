import { Router } from "express";
import { validateTicket } from "./ticket.controller";
import { auth } from "../../common/middleware/auth.middleware";

const router = Router();

router.get("/validate/:id" , validateTicket);

export default router;
