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
exports.validateTicket = void 0;
const booking_schema_1 = require("../booking/booking.schema");
const event_schema_1 = require("../events/event.schema");
const validateTicket = (bookingId, eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_schema_1.Booking.findById(bookingId);
    if (!booking)
        throw new Error("Invalid Ticket — Booking not found");
    // Check event match
    if (!booking.eventId.equals(eventId)) {
        throw new Error("Ticket does not belong to this event");
    }
    // Check if already used
    if (booking.status === "used")
        throw new Error("Ticket already used");
    // Mark as used
    booking.status = "used";
    yield booking.save();
    // Fetch event info
    const event = yield event_schema_1.Event.findById(eventId);
    return {
        message: "Ticket is valid",
        booking,
        event,
    };
});
exports.validateTicket = validateTicket;
