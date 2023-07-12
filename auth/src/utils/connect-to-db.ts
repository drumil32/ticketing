import mongoose from "mongoose";
import { DatabaseConnectionError } from "../errors";

export const connectToDB = async () => {
    try{
    const resp = await mongoose.connect(process.env.AUTH_MONGO_URI!);
    console.log('database is conneccted');
    }catch(err){
        throw new DatabaseConnectionError();
    }
}