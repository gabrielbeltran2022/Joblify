import {  ErrorHandler } from "../utils/Utilities.js";
import { refreshTokenPayload } from '../services/dataValidator.js';
import jwt from 'jsonwebtoken';
import { jwtPayloadSchema } from '../services/dataValidator.js'
import userModel from "../model/userModel.js";

export const authenticationUser = (...credentials) => {
    return async (req, res, next) => {
        try {
            const token = 
                req.headers.authorization?.split(' ')[1] || 
                req.cookies?.accessToken ||  req.cookies?.refreshToken;

            
            if (!token) {
                return ErrorHandler(res, 401, "Unauthorized: Access token missing");
            }

            let decoded;
       
            try {
           
                decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
              
            } catch (jwtErr) {
                  console.error("JWT VERIFY ERROR:", jwtErr);
                    return ErrorHandler(res, 401, "Invalid or expired access token");
            }

            const result = jwtPayloadSchema.safeParse(decoded);


            if (!result.success) {
                return ErrorHandler(res, 403, "Invalid token payload structure");
            }

            const existingUser = await userModel.findById(result.data.id);


            if (!existingUser) {
                return ErrorHandler(res, 404, "User account no longer exists");
            }
            req.user = existingUser;


            const targetUserId = req.user.id;
            

            const isOwnAccount = targetUserId && targetUserId.toString() === existingUser._id.toString();
            
            
            if (credentials.length > 0) {
                const userLevel = existingUser.accessLevel;
                const hasPermission = credentials.includes(userLevel) || 
                                      credentials.some(level => userLevel >= level);
                // console.log(userLevel)
                // console.log(hasPermission)
                // console.log(isOwnAccount)
                if (!hasPermission && !isOwnAccount) {
                    return ErrorHandler(res, 403, "Forbidden: Insufficient permissions");
                }
            }

            next();

        } catch (e) {
            console.error("Authentication Error:", e);
            return ErrorHandler(res, 500, "Internal Server Error during authentication");
        }
    };
};

export const verifyRefreshToken = (req,res,next) => {
    const token = req.cookies?.refreshToken 

    if(!token){
        return ErrorHandler(res,401,"Refresh Token required")
    }

    try{
        const decoded = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)

        const result = refreshTokenPayload.safeParse(decoded)

        if(!result.success){
            return ErrorHandler(res,403,"Invalid refresh Token structure")
        }

        req.user = result.data
        next();

    }catch(e){
        return ErrorHandler(res,500,"INTERNAL SERVER ERROR TOKEN")
    }
}