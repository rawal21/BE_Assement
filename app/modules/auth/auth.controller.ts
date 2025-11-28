import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthService } from "./auth.service";
import { createResponse } from "../../common/helper/response.helper";

export const AuthController = {
 
  register: asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.register(req.body);
    res.status(201).send(createResponse(user, "Register success!"));
  }),

 
  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.send(createResponse(result, "Login success..."));
  }),

  fetchUser : asyncHandler(async (req : Request , res:Response)=>{
    const id = req.params.id;
    const result = await AuthService.fetchUser(id);
    console.log("fetching the user" , result);
    res.send(createResponse(result , "fetch success!"))
  }) ,

  refreshToken : asyncHandler(async (req:Request , res:Response)=>{
    const result = await AuthService.refreshToken(req.body);
    res.send(createResponse(result , "refreshed the token."))
  })
};
