"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidation = [
    (0, express_validator_1.body)("name")
        .notEmpty().withMessage("Name is required")
        .isString().withMessage("Name must be a string"),
    (0, express_validator_1.body)("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),
    (0, express_validator_1.body)("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    (0, express_validator_1.body)("phone")
        .optional()
        .matches(/^[0-9]{10}$/).withMessage("Phone must be a 10-digit number"),
    (0, express_validator_1.body)("role")
        .optional()
        .isIn(["user", "admin"])
        .withMessage("Role must be either 'user' or 'admin'")
];
exports.loginValidation = [
    (0, express_validator_1.body)("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),
    (0, express_validator_1.body)("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];
