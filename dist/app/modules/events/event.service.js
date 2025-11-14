"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const event_schema_1 = require("./event.schema");
exports.EventService = {
    createEvent: (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const event = yield event_schema_1.Event.create(Object.assign(Object.assign({}, data), { createdBy: userId }));
        return event;
    }),
    getEvents: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield event_schema_1.Event.find();
    }),
    getEventById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const event = yield event_schema_1.Event.findById(id);
        if (!event)
            throw new Error("Event not found");
        return event;
    }),
    updateEvent: (id, data) => __awaiter(void 0, void 0, void 0, function* () {
        const event = yield event_schema_1.Event.findByIdAndUpdate(id, data, { new: true });
        if (!event)
            throw new Error("Event not found");
        return event;
    }),
    addSeatsEvent: (eventId, seats) => __awaiter(void 0, void 0, void 0, function* () {
        const event = yield event_schema_1.Event.findById(eventId);
        if (!event)
            throw new Error("Event not found");
        seats.forEach((seat) => {
            event.seats.push({
                seatId: seat.seatId,
                price: seat.price,
                status: "available",
                reservedBy: null,
                reservedAt: null,
            });
        });
        yield event.save();
        return event;
    }),
    reserveSeats: (eventId, seatIds, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const event = yield event_schema_1.Event.findById(eventId);
        if (!event)
            throw new Error("Event not found");
        const now = new Date();
        const reservedSeats = [];
        seatIds.forEach((seatId) => {
            const seat = event.seats.find((s) => s.seatId === seatId);
            if (!seat)
                throw new Error(`Seat ${seatId} not found`);
            if (seat.status !== "available")
                throw new Error(`Seat ${seatId} is already ${seat.status}`);
            seat.status = "reserved";
            seat.reservedBy = userId;
            seat.reservedAt = now;
            reservedSeats.push(seat); // ⬅ store only reserved seats
        });
        yield event.save();
        return reservedSeats; // ⬅ return only the selected reserved seats
    }),
};
