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
const node_cron_1 = __importDefault(require("node-cron"));
const event_schema_1 = require("../modules/events/event.schema");
node_cron_1.default.schedule("* * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("⏳ Running seat release job...");
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const events = yield event_schema_1.Event.find({
        "seats.status": "reserved",
        "seats.reservedAt": { $lte: tenMinutesAgo }
    });
    for (const event of events) {
        event.seats.forEach((seat) => {
            if (seat.status === "reserved" &&
                seat.reservedAt &&
                seat.reservedAt <= tenMinutesAgo) {
                seat.status = "available";
                seat.reservedBy = null;
                seat.reservedAt = null;
            }
        });
        yield event.save();
    }
    console.log("♻ Released expired reserved seats");
}));
