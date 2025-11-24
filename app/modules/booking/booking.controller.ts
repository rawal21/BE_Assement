import { Request, Response } from "express";
import * as BookingService from "./booking.service";
import asyncHandler from "express-async-handler";
import { createResponse } from "../../common/helper/response.helper";

/**
 * @swagger
 * /api/booking/{eventId}/book:
 *   post:
 *     summary: Book seats for an event
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to book seats for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - seatIds
 *             properties:
 *               seatIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - A1
 *                   - A2
 *     responses:
 *       201:
 *         description: Seats booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: "#/components/schemas/Booking"
 *                 message:
 *                   type: string
 *                   example: "booking success .."
 *       400:
 *         description: Invalid seat IDs
 *       401:
 *         description: Unauthorized
 */
// export const bookSeats = asyncHandler(async (req: Request, res: Response) => {
//   const { eventId } = req.params;
//   const { selectedSeats , total } = req.body;
//   const userId = req.user?._id;

//   console.log("the bebuggin in backend" , eventId)
//   console.log("userId" , userId);
// console.log("seats" , selectedSeats)

//   if (!selectedSeats|| !Array.isArray(selectedSeats)) {
//     return;
//   }

//   const booking = await BookingService.finalizeBooking(
//     eventId,
//     selectedSeats,
//     userId as string,
//     total 
//   );
//   res.send(createResponse(booking, "booking sucess .."));
// });

/**
 * @swagger
 * /api/booking:
 *   get:
 *     summary: Fetch all booking records
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fetch success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Booking"
 *                 message:
 *                   type: string
 *                   example: "fetch success.."
 *       401:
 *         description: Unauthorized
 */
export const fetchbooking = asyncHandler( async (req : Request , res : Response)=>{
    const id = req.user?._id as string;
    const result = await BookingService.fetchAllbooking(id);
    console.log("booking fetch " ,  result);
    res.send(createResponse(result , "fetch sucess.."))
})

export const fetchSingleBooking = asyncHandler(async (req :Request , res : Response)=>{
   const result = await BookingService.fetchSingleBooking(req.params.id)
   res.send((createResponse(result , "Single fetch success...")))
})
