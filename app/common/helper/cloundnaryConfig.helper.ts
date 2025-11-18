import { v2 as cloudinary } from "cloudinary";
import { loadingConfig } from "./config.helper";
loadingConfig();



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

console.log("cloud api_key" , process.env.CLOUDINARY_KEY)
console.log("cloud_name" , process.env.CLOUDINARY_NAME)



export default cloudinary;


