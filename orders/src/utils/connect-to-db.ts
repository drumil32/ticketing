import mongoose from "mongoose";
import { DatabaseConnectionError,Subjects } from "@micro_tickets/common";

export const connectToDB = async () => {
    try {
        const resp = await mongoose.connect(process.env.MONGO_URI!);
        console.log('database is conneccted');
    } catch (err) {
        throw new DatabaseConnectionError();
    }
}