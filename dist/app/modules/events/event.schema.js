"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = mongoose_1.default.Schema;
const seatSchema = new schema({
    seatId: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
        type: String,
        enum: ["available", "reserved", "booked"],
        default: "available",
    },
    reservedBy: { type: String, default: null },
    reservedAt: { type: Date, default: null },
});
const eventSchema = new schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    venue: { type: String, required: true },
    startAt: { type: Date, required: true },
    // ⭐ Correct User Reference
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    seats: [seatSchema],
}, { timestamps: true });
exports.Event = mongoose_1.default.model("Event", eventSchema);
