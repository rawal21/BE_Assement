import { Request, Response, NextFunction } from "express";
import asynchanlder from "express-async-handler"
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import type { IUser } from "../../modules/auth/auth.dto";

export const auth = asynchanlder(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    console.log("debuging the token" , token)

    if (!token) {
      throw createHttpError(401, {
        message: "Authorization token missing",
      });
    }

    try {
      const decodedUser = jwt.verify(token, process.env.JWT_SECRET as string);

      // ✅ Attach user to request
      req.user  = decodedUser as IUser;

      next();
    } catch (error: any) {
      if (error.message === "jwt expired") {
        throw createHttpError(401, {
          message: "Token expired",
          data: { type: "TOKEN_EXPIRED" },
        });
      }

      throw createHttpError(400, {
        message: error.message || "Invalid token",
      });
    }
  }
)
