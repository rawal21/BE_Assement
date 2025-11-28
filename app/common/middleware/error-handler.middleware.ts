import { type ErrorRequestHandler } from "express";
import { errorResponse } from "../helper/response.helper";
import { logger } from "../helper/winston.helper";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const response: errorResponse = {
    success: false,
    error_code: (err?.status ?? 500) as number,
    message: (err?.message ?? "Something went wrong!") as string,
    data: err?.data ?? {},
  };
    logger.error(`Error occurred: ${err.message}\nStack: ${err.stack}`);
  res.status(response.error_code).send(response);
  next();
};

export default errorHandler;
