import { Request, Response } from "express";
import * as TicketService from "./ticket.service";
import asyncHandler from "express-async-handler";
import { createResponse } from "../../common/helper/response.helper";

/**
 * @swagger
 * /api/ticket/validate:
 *   post:
 *     summary: Validate a ticket for an event
 *     tags: [Ticket]
 *     security:
 *       - bearerAuth: []      # ⬅️ THIS ENABLES TOKEN VERIFICATION
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - eventId
 *             properties:
 *               bookingId:
 *                 type: string
 *                 description: Booking ID of the ticket
 *                 example: "6735af2d91b3b8c4a1234567"
 *               eventId:
 *                 type: string
 *                 description: ID of the event
 *                 example: "672cbe1f82a1d7e05f123abc"
 *     responses:
 *       200:
 *         description: Ticket verification successful
 *       400:
 *         description: Missing bookingId or eventId
 *       401:
 *         description: Unauthorized — Missing or invalid token
 */
export const validateTicket = asyncHandler(
  async (req: Request, res: Response) => {
    const { bookingId, eventId } = req.body;

    if (!bookingId || !eventId) return;

    const data = await TicketService.validateTicket(bookingId, eventId);
    res.send(createResponse(data, "verification sucessfull .."));
  }
);
