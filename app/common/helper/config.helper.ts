import process from "process";
import dotenv from  "dotenv"
import path from "path"


export const loadingConfig = ()=>{
    const env = process.env.NODE_ENV ?? "local";
    const filepath = path.join(process.cwd(), `.env.${env}`)
    dotenv.config({path : filepath})
}