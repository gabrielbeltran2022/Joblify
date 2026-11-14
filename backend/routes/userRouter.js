import express from 'express';
import { verifyUser, requestEmailVerification, getUser, login, logoutUser, updateUser, getUserProfile, updateEducation, addEducation, updateCertification, addExpriences, updateExpriences, getUserExpriences, deleteUserExperiences, getUserCertificate, deleteCertificate, addCertification, getMe, getEducation, deleteEducation } from '../controller/userController.js';
import { validateUpdateUser, validateUpdateCertification, validateUpdateEducation, validateUpdateExperience, validateAddCertification, validateAddEducation } from '../services/dataValidator.js';
import { authenticationUser } from '../auth/auth.js';
import { uploadProfileImage, uploadCertificationImage } from '../services/upload.js';

const userRoute = express.Router();

// Public
userRoute.get('/get-user', getUser);
userRoute.post('/send-code', requestEmailVerification);
userRoute.post('/verify-signup', verifyUser);
userRoute.post('/login', login);
userRoute.post('/logout', logoutUser);
userRoute.get('/get-user-profile/:id', getUserProfile);
userRoute.get('/get-user-education/:id', getEducation);
userRoute.get('/user-experiences/:id', getUserExpriences);
userRoute.get('/get-certification/:id', getUserCertificate);

// Logged-in users (ownership is checked in each controller: isSelf || isAdmin)
userRoute.get('/me', authenticationUser(), getMe);

userRoute.put('/update-user/:id', authenticationUser(), uploadProfileImage.single('profiles'), validateUpdateUser, updateUser);

userRoute.post('/add-user-education/:id', authenticationUser(), validateAddEducation, addEducation);
userRoute.put('/update-user-education/:id/:eduId', authenticationUser(), validateUpdateEducation, updateEducation);
userRoute.delete('/delete-user-education/:id', authenticationUser(), deleteEducation);

userRoute.post('/add-user-expriences/:id', authenticationUser(), validateUpdateExperience, addExpriences);
userRoute.put('/update-user-expriences/:id/:expId', authenticationUser(), validateUpdateExperience, updateExpriences);
userRoute.delete('/delete-user-experiences/:id', authenticationUser(), deleteUserExperiences);

userRoute.post(
  '/add-user-certification/:id',
  authenticationUser(),
  uploadCertificationImage.single('certificationImage'),
  validateAddCertification,
  addCertification
);
userRoute.put(
  '/update-user-certification/:id/:certId',
  authenticationUser(),
  uploadCertificationImage.single('certificationImage'),
  validateUpdateCertification,
  updateCertification
);
userRoute.delete('/delete-user-certification/:certId', authenticationUser(), deleteCertificate);

export default userRoute;