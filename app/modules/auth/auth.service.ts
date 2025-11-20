import { User } from "./auth.schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const AuthService = {
  register: async (data: any) => {
    const { name, email, password, phone , wallet } = data;

    const existing = await User.findOne({ email });
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      wallet ,
      password: hashed,
    });

    return user;
  },

  login: async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return { token, user };
  },
 fetchUser : async(id : string )=>{
    return await User.findById(id);
  }
};

