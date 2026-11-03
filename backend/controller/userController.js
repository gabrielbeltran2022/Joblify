import userModel from "../model/userModel.js";
import verificationModel from '../model/verificationModel.js';
import Education from "../model/userEducation.js";
import {  ErrorHandler, SuccessHandler } from "../utils/Utilities.js";
import {cleanseData} from '../services/dataSanitize.js'
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtils.js";
import { generateAlphanumericCode } from '../utils/generateCodeVerification.js';
import {sendVerificationEmail} from '../services/emailSender.js'
import 'dotenv/config';
import Experience from "../model/userExprienceModel.js";




export const getUser = async (req, res) => {
  try {
    const userData = await userModel.find({});

    if (userData.length === 0) {
      return ErrorHandler(res, 404, "No users found");
    }

    return SuccessHandler(res, userData, "Users retrieved successfully", 200);

  } catch (e) {

    return ErrorHandler(res, 500, e.message); 
  }
};


export const getUserProfile = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const loggedInUser = req.user; 

        const isAdmin = loggedInUser.accessLevel === 2;
        const isEmployer = loggedInUser.accessLevel === 1;
        const isOwner = loggedInUser._id.toString() === targetUserId;

        if (!isAdmin && !isEmployer && !isOwner) {
            return ErrorHandler(res, 403, "Forbidden: You do not have permission to view this profile");
        }

        const existingUser = await userModel.findById(targetUserId);

        if (!existingUser) {
            return ErrorHandler(res, 404, "User does not exist");
        }

        return SuccessHandler(res, { user: existingUser }, "Successfully fetched profile", 200);
    } catch (e) {
        console.error("ERROR IN getUserProfile:", e);
        return ErrorHandler(res, 500, "INTERNAL SERVER ERROR GET PROFILE");
    }
};

export const createUser = async (req, res) => {
    const userData = req.body 
    const data = cleanseData(userData)

    try {
        const requiredFields = Object.keys(data)

        const missingField = requiredFields.filter(
            (field) => !data[field] || data[field].toString().trim() === ""
        );

        if (missingField.length > 0) {
            return ErrorHandler(res, 400, `Missing required fields: ${missingField.join(", ")}`);
        }
    

        const newUser = await userModel.create(data);

        return SuccessHandler(res, newUser, "User Successfully Created", 201);
    } catch (e) {
        return ErrorHandler(res, 500, e.message);
    }
};


export const updateUser = async (req, res) => {
    const targetUserId = req.params.id;
    const cleanData = cleanseData(req.body);
    const authUser = req.user;
    const authId = (authUser?._id || authUser?.id)?.toString();

    console.log("authId:", authId);

  if (!authUser || !authId) {
    return ErrorHandler(res, 401, 'Unauthorized: User authentication context missing');
  }

    try {
        if (!targetUserId) {
            return ErrorHandler(res, 400, 'User ID is required in the request body');
        }

            const userInDb = await userModel.findById(authId);

            if (!userInDb) {
            return ErrorHandler(res, 404, 'Authenticated user not found in database');
            }

            const accessLevel = userInDb.accessLevel;
       
        const isSelf = targetUserId === authId;
        const isAdmin = accessLevel === 2;


        if (!isSelf && !isAdmin) {
            return ErrorHandler(res, 403, 'Forbidden: Insufficient permissions');
        }

        if (req.file) {
            cleanData.profilePicture = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            targetUserId,
            { $set: cleanData,isProfileComplete: true },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return ErrorHandler(res, 404, 'User not found');
        }


        return SuccessHandler(res, updatedUser, 'User successfully updated', 200);

    } catch (e) {
        return ErrorHandler(res, 500, e.message);
    }
};

export const login = async (req, res) => {
    const data = cleanseData(req.body);

    try {
        const user = await userModel.findOne({ email: data.email });

        if (!user) {
            return ErrorHandler(res, 404, "User does not exist!");
        }

        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id)

        res.cookie('refreshToken', refreshToken,{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000      
         })


        return SuccessHandler(res, {
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            },
            accessToken
        }, "Login successful", 200);

    } catch (e) {
        return ErrorHandler(res, 500, "INTERNAL SERVER ERROR");
    }
};

export const logoutUser = async (req, res) => {
  
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    return SuccessHandler(res, 200, "Logged out successfully");
};

export const requestEmailVerification = async (req, res) => {
    try {
        const data = cleanseData(req.body);
        const email = data.email?.replace(/\s+/g, '').toLowerCase();

        if (!email) {
            return ErrorHandler(res, 400, "Email is required");
        }

        const existingUser = await userModel.findOne({ email });
        
        const code = generateAlphanumericCode(6);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

        
        await verificationModel.findOneAndUpdate(
            { email },
            { code, expiresAt },
            { upsert: true, returnDocument: 'after' }
        );

        await sendVerificationEmail(email, code);

        if (existingUser && existingUser.isVerified) {
            return SuccessHandler(res, { 
                email, 
                isVerified: true 
            }, "User is already verified. Proceeding to login.", 200);
        }


        return SuccessHandler(res, { 
            email, 
            isVerified: false 
        }, "Verification code sent to your email", 200);

    } catch (e) {
        console.error("CRASH ERROR IN requestEmailVerification:", e);
        return ErrorHandler(res, 500, "INTERNAL SERVER ERROR EMAIL");
    }
};


export const verifyUser = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return ErrorHandler(res, 400, "Email and verification code are required");
        }

        const cleanEmail = email.toString().trim().toLowerCase();
        const cleanCode = code.toString().trim().toUpperCase();


        const record = await verificationModel.findOne({ 
            email: cleanEmail, 
            code: cleanCode 
        });

        if (!record) {
            return ErrorHandler(res, 400, "Invalid or expired OTP code");
        }

        if (new Date() > record.expiresAt) {
            await verificationModel.deleteOne({ _id: record._id });
            return ErrorHandler(res, 400, "Verification code has expired");
        }

        let user = await userModel.findOne({ email: cleanEmail });

        if (!user) {
            user = await userModel.create({
                firstName: null,
                lastName: null,
                age: null,
                contact: null,
                email: cleanEmail,
                address: null,
                accessLevel: 0,
                isVerified: true,
                isProfileComplete: false
            });
        } else if (!user.isVerified) {
            user.isVerified = true;
            await user.save();
        }

        await verificationModel.deleteOne({ _id: record._id });

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

          res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });
       
        return SuccessHandler(res, {
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isProfileComplete: user.isProfileComplete
            }
        }, "Verification successful", 200);

    } catch (e) {
        console.error("CRASH ERROR IN verifyUser:", e);
        return ErrorHandler(res, 500, e.message || "INTERNAL_SERVER_ERROR CODE");
    }
};



export const updateEducation = async (req,res) => {
    
    const { id: targetUserId, ...restBody } = req.body;
    const cleanData = cleanseData(restBody);
    const authId = req.cookies?.id;
    const accessLevel = Number(req.cookies?.accessLevel);
    
    try{
        if (!targetUserId) {
            return ErrorHandler(res, 400, 'User ID is required in the request body');
        }

        const isSelf = targetUserId === authId;
        const isAdmin = accessLevel === 2;

        if (!isSelf && !isAdmin) {
            return ErrorHandler(res, 403, 'Forbidden: Insufficient permissions');
        }

        const updateEducation = await Education.findByIdAndUpdate(
            {userId: targetUserId},
            { $set: cleanData },
            { new: true, 
              runValidators: true,
              upsert: true,
              setDefaultsOnInsert: true 
            }
        );

        return SuccessHandler(res, updateEducation, 'User Education successfully updated', 200);

    }catch(e){
        return ErrorHandler(res,500,"INTERNAL SERVER ERROR Create Education")
    }
}



export const updateCertification = async (req, res) => {
  const { id: targetUserId, certId, ...restBody } = req.body;
  const cleanData = cleanseData(restBody);
  const authId = req.cookies?.id;
  const accessLevel = Number(req.cookies?.accessLevel);

  try {
    if (!targetUserId) {
      return ErrorHandler(res, 400, 'User ID is required in the request body');
    }

    const isSelf = targetUserId === authId;
    const isAdmin = accessLevel === 2;

    if (!isSelf && !isAdmin) {
      return ErrorHandler(res, 403, 'Forbidden: Insufficient permissions');
    }

    if (req.file) {
      cleanData.certificationImage = `/uploads/certifications/${req.file.filename}`;
    }

    const searchFilter = certId ? { _id: certId, userId: targetUserId } : { _id: uuidv4() };

    const updatedCertification = await Certification.findOneAndUpdate(
      searchFilter,
      { 
        $set: { 
          ...cleanData, 
          userId: targetUserId 
        } 
      },
      { 
        new: true, 
        runValidators: true,
        upsert: true,
        setDefaultsOnInsert: true 
      }
    );

    return SuccessHandler(
      res, 
      updatedCertification, 
      'Certification successfully saved', 
      200
    );

  } catch (e) {
    console.error("Error in updateCertification:", e);
    return ErrorHandler(res, 500, "INTERNAL SERVER ERROR: Save Certification");
  }
};

export const updateExpriences = async (req, res) => {
  const targetUserId = req.params.id;
  const cleanData = req.body; 
  const authUser = req.user;
  const authId = (authUser?._id || authUser?.id)?.toString();

  if (!authUser || !authId) {
    return ErrorHandler(res, 401, 'Unauthorized: User authentication context missing');
  }


  try {
    const userInDb = await userModel.findById(authId);
    if (!userInDb) {
      return ErrorHandler(res, 404, 'Authenticated user not found in database');
    }

    const isSelf = targetUserId === authId;
    const isAdmin = userInDb.accessLevel === 2;

    if (!isSelf && !isAdmin) {
      return ErrorHandler(res, 403, 'Forbidden: Insufficient permissions');
    }

    const experienceId = cleanData.id || cleanData._id || cleanData.expId;

    if (!experienceId) {
      const newExperience = new Experience({
        userId: targetUserId, 
        jobtitle: cleanData.jobtitle,
        company: cleanData.company,
        startDate: cleanData.startDate,
        endDate: cleanData.isCurrent ? null : cleanData.endDate,
        isCurrent: cleanData.isCurrent,
        description: cleanData.description,
      });

      const savedExperience = await newExperience.save();

      return SuccessHandler(res, savedExperience, 'Experience added successfully', 201);
    }

    const existingExperience = await Experience.findOne({
      _id: experienceId,
      userId: targetUserId,
    });

    if (!existingExperience) {
      return ErrorHandler(res, 404, 'Experience record not found for this user');
    }

    Object.assign(existingExperience, cleanData);
    const updatedExperience = await existingExperience.save();

    return SuccessHandler(res, updatedExperience, 'Experience updated successfully', 200);

  } catch (e) {
    console.error('Failed Request', e);
    return ErrorHandler(res, 500, 'INTERNAL SERVER ERROR');
  }
};

export const getUserExpriences = async (req, res) => {
  const targetUserId = req.params.id;

  try {
    if (!targetUserId) {
      return ErrorHandler(res, 400, "User ID is required");
    }

    const userExperiences = await Experience.find({ userId: targetUserId }).sort({ startDate: -1 });

    return SuccessHandler(res, userExperiences, "Successfully retrieved experiences", 200);
  } catch (e) {
    console.error("Failed request", e);
    return ErrorHandler(res, 500, "INTERNAL SERVER ERROR");
  }
};

export const deleteUserExpriences = async (req, res) => {
  const targetUserId = req.params.id;
  const cleanData = req.body; 
  const authUser = req.user;
  const authId = (authUser?._id || authUser?.id)?.toString();

  if (!authUser || !authId) {
    return ErrorHandler(res, 401, 'Unauthorized: User authentication context missing');
  }       

  try {
    const userInDb = await userModel.findById(authId);
    if (!userInDb) {
      return ErrorHandler(res, 404, 'Authenticated user not found in database');
    }

    const isSelf = targetUserId === authId;
    const isAdmin = userInDb.accessLevel === 2;

    if (!isSelf && !isAdmin) {
      return ErrorHandler(res, 403, 'Forbidden: Insufficient permissions');
    }

    const experienceId = cleanData.id || cleanData._id || cleanData.expId;

    if (!experienceId) {
      return ErrorHandler(res, 400, 'Bad Request: Experience ID is required');
    }

    const deletedExperience = await Experience.findOneAndDelete({
      _id: experienceId,
      userId: targetUserId, 
    });

    if (!deletedExperience) {
      return ErrorHandler(res, 404, 'Experience not found or does not belong to this user');
    }

    return SuccessHandler(res, deletedExperience, 'Successfully deleted', 200);

  } catch (e) {
    console.error('Server Failed', e);
    return ErrorHandler(res, 500, 'INTERNAL SERVER ERROR');
  }
};