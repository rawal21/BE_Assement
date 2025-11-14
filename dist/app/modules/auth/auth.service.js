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
exports.AuthService = void 0;
const auth_schema_1 = require("./auth.schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.AuthService = {
    register: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, email, password, phone, wallet } = data;
        const existing = yield auth_schema_1.User.findOne({ email });
        if (existing)
            throw new Error("User already exists");
        const hashed = yield bcrypt_1.default.hash(password, 10);
        const user = yield auth_schema_1.User.create({
            name,
            email,
            phone,
            wallet,
            password: hashed,
        });
        return user;
    }),
    login: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield auth_schema_1.User.findOne({ email });
        if (!user)
            throw new Error("Invalid credentials");
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match)
            throw new Error("Invalid credentials");
        const token = jsonwebtoken_1.default.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return { token, user };
    }),
};
