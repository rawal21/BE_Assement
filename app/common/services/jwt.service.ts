import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../../modules/auth/auth.schema";
import createHttpError from "http-errors";

// ------------------------
// CREATE ACCESS TOKEN
// ------------------------
export const createAccessToken = (payload: { _id: string; role: string }): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not found");

  return jwt.sign(payload, secret, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "15m",
  });
};

// ------------------------
// CREATE REFRESH TOKEN
// ------------------------
export const createRefreshToken = (payload: { _id: string; role: string }): string => {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) throw new Error("REFRESH_TOKEN_SECRET not found");

  return jwt.sign(payload, secret, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d",
  });
};

// ------------------------
// VERIFY REFRESH TOKEN
// ------------------------
export const verifyRefreshToken = async (token: string) => {
  const user = await User.findOne({ refreshToken: token });
  if (!user) throw createHttpError(403, "Forbidden - Invalid refresh token");

  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) throw new Error("REFRESH_TOKEN_SECRET not defined");

  const payload = jwt.verify(token, secret) as JwtPayload;

  return {
    user,
    payload,
  };
};

// ------------------------
// SAVE REFRESH TOKEN
// ------------------------
export const saveRefreshToken = async (userId: string, token: string) => {
  await User.findByIdAndUpdate(userId, { refreshToken: token }, { new: true });
};

// ------------------------
// REVOKE (DELETE) REFRESH TOKEN
// ------------------------
export const revokeRefreshToken = async (token: string) => {
  await User.updateOne({ refreshToken: token }, { $unset: { refreshToken: "" } });
};
