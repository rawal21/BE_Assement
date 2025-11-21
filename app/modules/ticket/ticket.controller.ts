import { Request, Response } from "express";
import * as TicketService from "./ticket.service";
import asyncHandler from "express-async-handler";
import { createResponse } from "../../common/helper/response.helper";
import { fetchSingleBooking } from "../booking/booking.service";

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
export const validateTicket = async (req: Request, res: Response) => {
  const bookingId = req.params.id;

  if (!bookingId) {
    return res.send(renderHtml("Invalid Request", "No booking ID provided.", "error"));
  }

  const booking = await fetchSingleBooking(bookingId);

  if (!booking) {
    return res.send(renderHtml("Invalid Ticket", "This ticket does not exist.", "error"));
  }

  try {
    const result = await TicketService.validateTicket(
      bookingId,
      booking.eventId as any
    );

    if (!result?.valid) {
      return res.send(
        renderHtml("Ticket Invalid", result.message || "This ticket is not valid.", "error")
      );
    }

    return res.send(
      renderHtml("Ticket Verified", "Entry Approved — Ticket is valid.", "success")
    );

  } catch (err: any) {
    return res.send(
      renderHtml("Ticket Invalid", err.message || "This ticket is not valid.", "error")
    );
  }
};



function renderHtml(title: string, message: string, status: "success" | "error") {
  const color = status === "success" ? "#16a34a" : "#dc2626";

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f3f4f6;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .card {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          text-align: center;
          width: 90%;
          max-width: 400px;
        }
        h1 {
          color: ${color};
          margin-bottom: 10px;
        }
        p {
          color: #374151;
          font-size: 18px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>${title}</h1>
        <p>${message}</p>
      </div>
    </body>
  </html>
  `;
}


