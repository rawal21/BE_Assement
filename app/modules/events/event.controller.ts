import { Request, Response } from "express";
import { EventService } from "./event.service";
import asyncHandler from "express-async-handler";
import { createResponse } from "../../common/helper/response.helper";

export const EventController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const event = await EventService.createEvent(
      req.body,
      userId as string,
      req.file
    );
    res.send(createResponse(event, "event created sucess "));
  }),

  addImage: asyncHandler(async (req: Request, res: Response) => {
    const result = await EventService.addimage(req.params.id, req?.file);
    if (!result) throw new Error("we are having the issue..");
    console.log("what is the issue we are facing", result);
    res.send(createResponse(result, "image added sucess .."));
  }),

  getAll: asyncHandler(async (req: Request, res: Response) => {
    const events = await EventService.getEvents();
    console.log("the event fatching in events ", events);
    res.send(createResponse(events, "fetch sucess.."));
  }),

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const event = await EventService.getEventById(req.params.id);
    res.send(createResponse(event, "fetch sucess.."));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const event = await EventService.updateEvent(req.params.id, req.body);
    res.send(createResponse(event, "update sucess.."));
  }),

  reserveSeats: asyncHandler(async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const { seatIds, userId } = req.body;

    // const userId = req.user?._id;

    if (!seatIds || !Array.isArray(seatIds)) {
      res.status(400).json({
        success: false,
        message: "seatIds array is required",
      });
      return; // IMPORTANT
    }
    const data = await EventService.reserveSeats(
      eventId,
      seatIds,
      userId as string
    );
    res.send(createResponse(data, "resvered done.."));
  }),
};
