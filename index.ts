import express, { type Express, type Request, type Response } from "express";
import http from "http";
import morgan from "morgan";
import cors from  'cors'
import { loadingConfig } from "./app/common/helper/config.helper";
import { initDb } from "./app/common/services/database.service";
import routes from "./app/routes";
import { IUser } from "./app/modules/auth/auth.dto";
import "./app/crons/releaseReservedSeats.cron";
import errorHandler from "./app/common/middleware/error-handler.middleware";

// Swagger imports
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from "./app/common/services/swegger.serive";
import cloudinary from "./app/common/helper/cloundnaryConfig.helper";
const swaggerSpec = swaggerJSDoc(swaggerOptions);

loadingConfig();

const port = Number(process.env.PORT) ?? 3000;
const app: Express = express();

declare global {
  namespace Express {
    interface User extends Omit<IUser, "password"> {}
    interface Request {
      user?: User;
    }
  }
}

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3002"],
  credentials: true,
}));

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const initApp = async () => {
  await initDb();

  // API routes
  app.use("/api", routes);

  // Root route
  app.get("/", (req: Request, res: Response) => {
    res.send("Server is ready..");
  });

  // Error handler
  app.use(errorHandler);

  // Start server
  http.createServer(app).listen(port, () => {
    console.log(`Server is running at port ${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
  });
};

initApp();
