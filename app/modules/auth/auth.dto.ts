import { BaseSchema } from "../../common/dto/base.dto";

export interface IUser extends BaseSchema {
 name: string;
  email: string;
  password: string;
  phone?: string;
  role: "user" | "admin";
  wallet : number
}