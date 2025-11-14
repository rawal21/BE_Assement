"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = mongoose_1.default.Schema;
const bookingSchema = new schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    eventId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    seats: [
        { type: String, required: true }, // seatIds only
    ],
    amount: { type: Number, required: true },
    qrCode: { type: String },
    status: {
        type: String,
        enum: ["booked", "used"],
        default: "booked",
    },
}, { timestamps: true });
exports.Booking = mongoose_1.default.model("Booking", bookingSchema);
