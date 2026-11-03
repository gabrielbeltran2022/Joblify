import jwt from 'jsonwebtoken';
import userModel from '../model/userModel.js';
import { ErrorHandler, SuccessHandler } from '../utils/Utilities.js';
import { generateAccessToken } from '../utils/tokenUtils.js';

export const handleRefreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return ErrorHandler(res, 401, "Unauthorized: Refresh token missing");
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return ErrorHandler(res, 404, "User not found");
        }

        if (!user.isVerified) {
            return ErrorHandler(res, 403, "User account is not verified");
        }


        const newAccessToken = generateAccessToken(user._id, user.accessLevel);

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            });


        return SuccessHandler(res, { accessToken: newAccessToken }, "Token is successfully refreshed", 200);

    } catch (e) {
 
        console.error("ERROR IN handleRefreshToken:", e);

        if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
            return ErrorHandler(res, 401, "Invalid or expired refresh token. Please log in again.");
        }

        return ErrorHandler(res, 500, e.message || "INTERNAL SERVER ERROR TOKEN IS NOT REFRESH");
    }
};