import express from 'express';
import { connectDb } from './database/db.js'; 
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import path from "path";
import userRoute from './routes/userRouter.js';
import authRoute from './routes/authRouter.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-type', 'Authorization']
}));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public"))); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', userRoute);
app.use('/api', authRoute)

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDb(); 
        console.log("Database connected!");
        
        app.listen(PORT, () => {
            console.log(`Your port is running on ${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};

startServer();