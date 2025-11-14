"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("./modules/auth/auth.route"));
const event_route_1 = __importDefault(require("./modules/events/event.route"));
const booking_routes_1 = __importDefault(require("./modules/booking/booking.routes"));
const ticket_routes_1 = __importDefault(require("./modules/ticket/ticket.routes"));
const router = (0, express_1.Router)();
router.use("/auth", auth_route_1.default);
router.use("/event", event_route_1.default);
router.use("/booking", booking_routes_1.default);
router.use("/ticket", ticket_routes_1.default);
exports.default = router;
