import { User } from "./auth.schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import * as jwtService from "../../common/services/jwt.service"
export const AuthService = {
  register: async (data: any) => {
    const { name, email, password, phone, wallet } = data;

    const existing = await User.findOne({ email });
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      wallet,
      password: hashed,
    });

    return user;
  },

  login: async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");


    const paylaod = {_id : user._id , role : user.role}

    const token = await jwtService.createAccessToken(paylaod);
    const refreshToken = await jwtService.createRefreshToken(paylaod)
   await  jwtService.saveRefreshToken(user._id , refreshToken);
    await user.save();

    return { token, refreshToken, user };
  },
  fetchUser: async (id: string) => {
    return await User.findById(id);
  },

  refreshToken : async (refreshToken : string)=>{
    if(!refreshToken) throw createHttpError(401 , "refresh token is missing.")
     const {user , payload} = await jwtService.verifyRefreshToken(refreshToken);
    const newAccesstoken = jwtService.createAccessToken({_id : payload._id as string , role : payload.role as string});
    return {token : newAccesstoken};
  }
};
