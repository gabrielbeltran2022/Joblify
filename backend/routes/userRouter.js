import express from 'express';
import { verifyUser,requestEmailVerification, getUser, login, logoutUser, updateUser, getUserProfile,updateEducation, updateCertification, updateExpriences, getUserExpriences } from '../controller/userController.js';
import { validateUpdateUser,validateUpdateCertification,validateUpdateEducation,validateUpdateExperience } from '../services/dataValidator.js';
import { authenticationUser } from '../auth/auth.js';
import {uploadProfileImage,uploadCertificationImage} from '../services/upload.js'

const userRoute = express.Router();

userRoute.get('/get-user', getUser)

userRoute.post('/send-code', requestEmailVerification);

userRoute.post('/verify-signup', verifyUser);

userRoute.put('/update-user/:id', authenticationUser(2), uploadProfileImage.single('profilePicture'), validateUpdateUser, updateUser);

userRoute.get('/get-user-profile/:id', authenticationUser(2), getUserProfile);

userRoute.put('/update-user-education/:id', authenticationUser(2), validateUpdateEducation, updateEducation);

userRoute.put('/update-user-certification/:id', authenticationUser(2), uploadCertificationImage.single('certificationImage'), validateUpdateCertification, updateCertification);

userRoute.post('/update-user-expriences/:id', authenticationUser(2), validateUpdateExperience, updateExpriences)

userRoute.get('/user-experiences/:id', getUserExpriences)

userRoute.post('/login',login)

userRoute.post('/logout',logoutUser)



export default userRoute