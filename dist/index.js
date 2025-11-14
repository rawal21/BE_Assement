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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const morgan_1 = __importDefault(require("morgan"));
const config_helper_1 = require("./app/common/helper/config.helper");
const database_service_1 = require("./app/common/services/database.service");
const routes_1 = __importDefault(require("./app/routes"));
require("./app/crons/releaseReservedSeats.cron");
const error_handler_middleware_1 = __importDefault(require("./app/common/middleware/error-handler.middleware"));
// Swagger imports
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swegger_serive_1 = require("./app/common/services/swegger.serive");
const swaggerSpec = (0, swagger_jsdoc_1.default)(swegger_serive_1.swaggerOptions);
(0, config_helper_1.loadingConfig)();
const port = (_a = Number(process.env.PORT)) !== null && _a !== void 0 ? _a : 3000;
const app = (0, express_1.default)();
// middlewares
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
// Swagger route
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
const initApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, database_service_1.initDb)();
    // API routes
    app.use("/api", routes_1.default);
    // Root route
    app.get("/", (req, res) => {
        res.send("Server is ready..");
    });
    // Error handler
    app.use(error_handler_middleware_1.default);
    // Start server
    http_1.default.createServer(app).listen(port, () => {
        console.log(`Server is running at port ${port}`);
        console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
    });
});
initApp();
