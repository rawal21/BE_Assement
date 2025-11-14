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
exports.auth = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.auth = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    console.log("debuging the token", token);
    if (!token) {
        throw (0, http_errors_1.default)(401, {
            message: "Authorization token missing",
        });
    }
    try {
        const decodedUser = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // ✅ Attach user to request
        req.user = decodedUser;
        next();
    }
    catch (error) {
        if (error.message === "jwt expired") {
            throw (0, http_errors_1.default)(401, {
                message: "Token expired",
                data: { type: "TOKEN_EXPIRED" },
            });
        }
        throw (0, http_errors_1.default)(400, {
            message: error.message || "Invalid token",
        });
    }
}));
