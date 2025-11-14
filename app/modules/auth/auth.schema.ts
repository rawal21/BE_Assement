import mongoose, { Schema }  from "mongoose";
import { IUser } from "./auth.dto";

const schema = mongoose.Schema;

const userSchema = new schema<IUser>(
     {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    wallet : {type : Number, default : 0}
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);