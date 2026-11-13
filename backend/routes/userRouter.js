import express from 'express';
import { verifyUser,requestEmailVerification, getUser, login, logoutUser, updateUser, getUserProfile,updateEducation,addEducation, updateCertification,addExpriences, updateExpriences, getUserExpriences,deleteUserExperiences ,getUserCertificate,deleteCertificate,addCertification,getMe, getEducation } from '../controller/userController.js';
import { validateUpdateUser,validateUpdateCertification,validateUpdateEducation,validateUpdateExperience,validateAddCertification,validateAddEducation } from '../services/dataValidator.js';
import { authenticationUser } from '../auth/auth.js';
import {uploadProfileImage,uploadCertificationImage} from '../services/upload.js'


const userRoute = express.Router();

userRoute.get('/get-user', getUser)

userRoute.post('/send-code', requestEmailVerification);

userRoute.post('/verify-signup', verifyUser);

userRoute.put('/update-user/:id', authenticationUser(2), uploadProfileImage.single('profiles'), validateUpdateUser, updateUser);

userRoute.get('/get-user-profile/:id', getUserProfile);

userRoute.post('/add-user-education/:id', authenticationUser(2), validateAddEducation, addEducation);

userRoute.put('/update-user-education/:id', authenticationUser(2), validateUpdateEducation, updateEducation);

userRoute.get('/get-user-education/:id',getEducation)

userRoute.get('/me', authenticationUser(2), getMe);

userRoute.post('/add-user-expriences/:id', authenticationUser(2), validateUpdateExperience, addExpriences)

userRoute.put('/update-user-expriences/:id/:expId', authenticationUser(2), validateUpdateExperience, updateExpriences)

userRoute.get('/user-experiences/:id', getUserExpriences)

userRoute.delete('/delete-user-experiences/:id', authenticationUser(2), deleteUserExperiences)

userRoute.get('/get-certification/:id', getUserCertificate)


userRoute.delete('/delete-user-certification/:certId', authenticationUser(2), deleteCertificate)

userRoute.post(
  "/add-user-certification/:id",
  authenticationUser(2),
  uploadCertificationImage.single("certificationImage"),
  validateAddCertification,
  addCertification
);
 
userRoute.put(
  "/update-user-certification/:id/:certId",
  authenticationUser(2),
  uploadCertificationImage.single("certificationImage"),
  validateUpdateCertification,
  updateCertification
);


userRoute.post('/login',login)

userRoute.post('/logout',logoutUser)



export default userRoute