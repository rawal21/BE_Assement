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
exports.EventController = void 0;
const event_service_1 = require("./event.service");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const response_helper_1 = require("../../common/helper/response.helper");
exports.EventController = {
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
    create: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const event = yield event_service_1.EventService.createEvent(req.body, userId);
        res.send((0, response_helper_1.createResponse)(event, "event created sucess "));
    })),
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
    getAll: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const events = yield event_service_1.EventService.getEvents();
        res.send((0, response_helper_1.createResponse)(events, "fetch sucess.."));
    })),
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
    getOne: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const event = yield event_service_1.EventService.getEventById(req.params.id);
        res.send((0, response_helper_1.createResponse)(event, "fetch sucess.."));
    })),
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
    update: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const event = yield event_service_1.EventService.updateEvent(req.params.id, req.body);
        res.send((0, response_helper_1.createResponse)(event, "update sucess.."));
    })),
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
    addSeats: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { eventId } = req.params;
        const { seats } = req.body;
        if (!seats || !Array.isArray(seats)) {
            res.status(400).json({
                success: false,
                message: "Seats array is required",
            });
            return; // IMPORTANT
        }
        const data = yield event_service_1.EventService.addSeatsEvent(eventId, seats);
        res.send((0, response_helper_1.createResponse)(data, "added sucess.."));
    })),
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
    reserveSeats: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { eventId } = req.params;
        const { seatIds } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!seatIds || !Array.isArray(seatIds)) {
            res.status(400).json({
                success: false,
                message: "seatIds array is required",
            });
            return; // IMPORTANT
        }
        const data = yield event_service_1.EventService.reserveSeats(eventId, seatIds, userId);
        res.send((0, response_helper_1.createResponse)(data, "resvered done.."));
    })),
};
