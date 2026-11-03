import express from 'express';
import { verifyRefreshToken } from '../auth/auth.js'; 
import { handleRefreshToken } from '../controller/refreshTokenController.js';

const authRoute = express.Router();

authRoute.post('/refresh', verifyRefreshToken, handleRefreshToken);

export default authRoute;