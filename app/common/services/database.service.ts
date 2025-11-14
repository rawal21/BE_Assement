import mongoose from "mongoose";

export const  initDb = async () : Promise<boolean>=>{
    return await new Promise((resolve , reject)=>{
        const mongoUri = process.env.MONGO_URL || "";
        if(mongoUri === "") throw new Error("mongoUri is not found ..")
        mongoose.set("strictQuery" , false);
        mongoose
        .connect(mongoUri)
        .then(()=>{
            console.log("db connected !")
            resolve(true)
        })
        .catch(reject)
    })
}