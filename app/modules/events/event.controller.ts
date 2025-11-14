import { Request, Response } from "express";
import { EventService } from "./event.service";
import asyncHandler from "express-async-handler";
import { createResponse } from "../../common/helper/response.helper";

export const EventController = {
     /**
   * @swagger
   * /api/event:
   *   post:
   *     summary: Create a new event
   *     tags: [Event]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/Event"
   *     responses:
   *       201:
   *         description: Event created successfully
   */
  create: asyncHandler(async (req: Request, res: Response) => {
     const userId  = req.user?._id ;
    const event = await EventService.createEvent(req.body , userId as string);
    res.send(createResponse(event, "event created sucess "));
  }), 
  /**
   * @swagger
   * /api/event:
   *   get:
   *     summary: Get all events
   *     tags: [Event]
   *     responses:
   *       200:
   *         description: Fetch success
   */

  getAll: asyncHandler(async (req: Request, res: Response) => {
    const events = await EventService.getEvents();
    res.send(createResponse(events, "fetch sucess.."));
  }),

  /**
   * @swagger
   * /api/event/{id}:
   *   get:
   *     summary: Get an event by ID
   *     tags: [Event]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Event ID
   *     responses:
   *       200:
   *         description: Fetch success
   */

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const event = await EventService.getEventById(req.params.id);
    res.send(createResponse(event, "fetch sucess.."));
  }),

   /**
   * @swagger
   * /api/event/{id}:
   *   put:
   *     summary: Update an event
   *     tags: [Event]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Event ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/Event"
   *     responses:
   *       200:
   *         description: Event updated successfully
   */

  update: asyncHandler(async (req: Request, res: Response) => {
    const event = await EventService.updateEvent(req.params.id, req.body);
    res.send(createResponse(event, "update sucess.."));
  }),

  /**
   * @swagger
   * /api/event/{eventId}/seats:
   *   post:
   *     summary: Add seats to an event
   *     tags: [Event]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: eventId
   *         required: true
   *         schema:
   *           type: string
   *         description: Event ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - seats
   *             properties:
   *               seats:
   *                 type: array
   *                 items:
   *                   $ref: "#/components/schemas/Seat"
   *                 example:
   *                   - seatId: A1
   *                     price: 100
   *                   - seatId: A2
   *                     price: 120
   *     responses:
   *       200:
   *         description: Seats added successfully
   */

   addSeats: asyncHandler(async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const { seats } = req.body;

    if (!seats || !Array.isArray(seats)) {
      res.status(400).json({
        success: false,
        message: "Seats array is required",
      });
      return; // IMPORTANT
    }
    const data = await EventService.addSeatsEvent(eventId, seats);
    res.send(createResponse(data, "added sucess.."));
  }),

  /**
   * @swagger
   * /api/event/{eventId}/reserve:
   *   post:
   *     summary: Reserve seats temporarily before booking
   *     tags: [Event]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: eventId
   *         required: true
   *         schema:
   *           type: string
   *         description: Event ID
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
   *       200:
   *         description: Seats reserved successfully
   */
  reserveSeats: asyncHandler(async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const { seatIds } = req.body;
    
    const userId = req.user?._id;

    if (!seatIds || !Array.isArray(seatIds)) {
      res.status(400).json({
        success: false,
        message: "seatIds array is required",
      });
      return; // IMPORTANT
    }
    const data = await EventService.reserveSeats(eventId, seatIds, userId as string);
    res.send(createResponse(data, "resvered done.."));
  }),
};