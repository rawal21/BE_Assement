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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookSeats = void 0;
const event_schema_1 = require("../events/event.schema");
const booking_schema_1 = require("./booking.schema");
const qrcode_1 = __importDefault(require("qrcode"));
const email_1 = require("../../utils/email");
const emailTemplates_1 = require("../../utils/emailTemplates");
const auth_schema_1 = require("../auth/auth.schema");
const bookSeats = (eventId, seatIds, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield event_schema_1.Event.findById(eventId);
    if (!event)
        throw new Error("Event not found");
    let totalAmount = 0;
    const now = new Date();
    // VALIDATE + auto-reserve seats
    for (const seatId of seatIds) {
        const seat = event.seats.find((s) => s.seatId === seatId);
        if (!seat)
            throw new Error(`Seat ${seatId} not found`);
        if (seat.status === "booked") {
            throw new Error(`Seat ${seatId} is already booked`);
        }
        if (seat.status === "reserved" && seat.reservedBy !== userId) {
            throw new Error(`Seat ${seatId} is reserved by another user`);
        }
        if (seat.status === "available") {
            seat.status = "reserved";
            seat.reservedBy = userId;
            seat.reservedAt = new Date();
        }
        if (seat.status === "reserved" && seat.reservedBy === userId) {
            const diff = now.getTime() - seat.reservedAt.getTime();
            if (diff > 10 * 60 * 1000) {
                seat.reservedAt = new Date();
            }
        }
        totalAmount += seat.price;
    }
    // FETCH USER
    const user = yield auth_schema_1.User.findById(userId);
    if (!user)
        throw new Error("User not found");
    // VALIDATE WALLET
    if (user.wallet < totalAmount) {
        throw new Error(`Insufficient wallet balance. Required: ${totalAmount}, Available: ${user.wallet}`);
    }
    // DEDUCT MONEY
    user.wallet -= totalAmount;
    yield user.save();
    // FINAL BOOKING PROCESS
    seatIds.forEach((seatId) => {
        const seat = event.seats.find((s) => s.seatId === seatId);
        seat.status = "booked";
        seat.reservedAt = null;
        seat.reservedBy = null;
    });
    event.markModified("seats");
    yield event.save();
    // CREATE BOOKING
    const booking = yield booking_schema_1.Booking.create({
        userId,
        eventId,
        seats: seatIds,
        amount: totalAmount,
    });
    // GENERATE QR (BUFFER FOR EMAIL)
    const qrBuffer = yield qrcode_1.default.toBuffer(booking._id.toString());
    // SAVE BASE64 IN DB (optional)
    booking.qrCode = qrBuffer.toString("base64");
    yield booking.save();
    // EMAIL HTML (CID BASED)
    const emailHTML = (0, emailTemplates_1.ticketConfirmationTemplate)(user.name, event.title, seatIds);
    // SEND EMAIL WITH ATTACHMENT
    yield (0, email_1.sendEmail)(user.email, `Your Ticket for ${event.title}`, emailHTML, [
        {
            filename: "ticket-qr.png",
            content: qrBuffer,
            cid: "qrCodeImage", // MUST MATCH template
        },
    ]);
    return booking;
});
exports.bookSeats = bookSeats;
