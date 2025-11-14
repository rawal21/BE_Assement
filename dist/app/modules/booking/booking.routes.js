"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("./booking.controller");
const auth_middleware_1 = require("../../common/middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/:eventId/book", auth_middleware_1.auth, booking_controller_1.bookSeats);
exports.default = router;
