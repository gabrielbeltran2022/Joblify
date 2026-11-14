import Employer from "../model/userEmployerModel.js";
import userModel from "../model/userModel.js";
import { SuccessHandler, ErrorHandler } from "../utils/Utilities.js";

export const addCompany = async (req, res) => {
    const targetUserId = req.params.id;
    const authId = req.user._id
    const cleanData = req.body

    if (!authId) {
        return ErrorHandler(res, 400, "User Id is required")
    }

    try {
        const userInDb = await userModel.findById(authId)

        if (!userInDb) {
            return ErrorHandler(res, 404, "User is not exists!")
        }

        const accessLevel = userInDb.accessLevel;

        const isSelf = authId === targetUserId
        const isAdmin = accessLevel === 2

        if (!isSelf && !isAdmin) {
            return ErrorHandler(res, 403, 'Forbidden: Insufficient permissions');
        }

        const newCompany = new Employer({
            userId: authId,
            companyName: cleanData.companyName,
            industry: cleanData.industry,
            founded: cleanData.founded,
            location: cleanData.location,
            companySize: cleanData.companySize,
            isEmployer: true
        })

        const saveCompany = await newCompany.save();

        return SuccessHandler(res, saveCompany, "Successfully Created!")

    } catch (e) {
        return ErrorHandler(res, 500, "INTERNAL_SERVER_ERROR")
    }
}

export const updateCompany = async (req, res) => {
    const { id: targetUserId, companyId } = req.params;
    const authId = req.user?._id || req.user;
    const cleanData = req.body;

    if (!authId) {
        return ErrorHandler(res, 404, "unauthorized User")
    }

    if (!companyId) {
        return ErrorHandler(res, 404, "Company Id is required")
    }
    try {
        const userInDb = await userModel.findById(authId)

        if (!userInDb) {
            return ErrorHandler(res, 404, "User is not exists!")
        }

        const accessLevel = userInDb.accessLevel;

        const isSelf = authId === targetUserId
        const isAdmin = accessLevel === 2

        if (!isSelf && !isAdmin) {
            return ErrorHandler(res, 403, 'Forbidden: Insufficient permissions');
        }
        const filter = isAdmin ? { _id: companyId } : { _id: companyId, userId: authId };

        const updatedCompany = await Employer.findOneAndUpdate(
            filter,
            { $set: cleanData },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedCompany) {
            return ErrorHandler(res, 404, "Company not found or you do not have permission to edit it");
        }

        return SuccessHandler(res, updatedCompany, "Company successfully updated!", 200);

    } catch (e) {
        return ErrorHandler(res, 500, "INTERNAL_SERVER_ERROR")
    }
}



export const getEmployerCompany = async (req, res) => {
    const { companyId } = req.params;

    try {
        if (!companyId) {
            return ErrorHandler(res, 400, "Company ID is required");
        }

        const existsCompany = await Employer.findById(companyId);

        if (!existsCompany) {
            return ErrorHandler(res, 404, "Company does not exist!");
        }

        return SuccessHandler(res, existsCompany, "Successfully retrieved", 200);

    } catch (e) {

        return ErrorHandler(res, 500, "INTERNAL_SERVER_ERROR");
    }
};
export const getAllCompany = async (req, res) => {
    try {
        const getAllCompanyList = await Employer.find({})
        return SuccessHandler(res, getAllCompanyList, "Successfully retrieved all companies", 200);
    } catch (e) {
        return ErrorHandler(res, 500, "INTERNAL_SERVER_ERROR")
    }
}

export const deleteCompany = async (req, res) => {
    const { id: targetUserId, companyId } = req.params;
    const authUser = req.user;
    const authId = (authUser?._id || authUser?.id)?.toString();

    if (!authUser || !authId) {
        return ErrorHandler(res, 401, 'Unauthorized: User authentication context missing');
    }

    if (!companyId) {
        return ErrorHandler(res, 400, 'Company Id is required');
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

        const deletedCompany = await Employer.findOneAndDelete({
            _id: companyId,
            userId: targetUserId,
        });

        if (!deletedCompany) {
            return ErrorHandler(res, 404, 'Company not found or does not belong to this user');
        }

        return SuccessHandler(res, deletedCompany, 'Successfully deleted', 200);
    } catch (e) {
        console.error('deleteCompany error:', e);
        return ErrorHandler(res, 500, 'INTERNAL_SERVER_ERROR');
    }
};
