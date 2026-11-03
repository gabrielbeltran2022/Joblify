import mongoose from "mongoose";
import 'dotenv/config';

export const connectDb = async () => {
    try {
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Successfully connected to MongoDB Atlas');
    } catch (e) {
        console.error('❌ Atlas Failed Connection', e);
    }
};