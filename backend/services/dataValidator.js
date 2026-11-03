import { z } from 'zod';
import { ErrorHandler } from '../utils/Utilities.js';
import { cleanseData } from './dataSanitize.js';

/* ==========================================================================
   USER VALIDATION
   ========================================================================== */

export const updateUserSchema = z.object({
  firstName: z
    .string({ required_error: 'First name is required' })
    .trim()
    .min(1, { message: 'First name cannot be empty' }),

  lastName: z
    .string({ required_error: 'Last name is required' })
    .trim()
    .min(1, { message: 'Last name cannot be empty' }),

  middleName: z
  .string()
  .trim()
  .nullable()
  .optional()
  .transform((val) => (val === "" ? null : val)),

suffix: z
  .string()
  .trim()
  .nullable()
  .optional()
  .transform((val) => (val === "" ? null : val)),
  
  profession: z.string().trim().optional(),

  dateOfBirth: z.coerce
    .date({ invalid_type_error: 'Invalid date format' })
    .optional(),

  contact: z
    .string({ required_error: 'Contact is required' })
    .trim()
    .min(10, { message: 'Contact must be at least 10 digits' })
    .optional(),

  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email({ message: 'Invalid email format' }),

  jobtitle: z
    .string({ required_error: 'Job title is required' })
    .trim()
    .min(1, { message: 'Job title cannot be empty' }),

  address: z
    .string({ required_error: 'Address is required' })
    .trim()
    .min(1, { message: 'Address cannot be empty' })
    .optional(),

  gender: z.enum(['Male', 'Female'], {
    errorMap: () => ({ message: 'Gender must be female or male' }),
  }),

  accessLevel: z.coerce
    .number({ invalid_type_error: 'Access level must be a number' })
    .int({ message: 'Access level must be an integer' })
    .min(0, { message: 'Access level must be between 0 and 2' })
    .max(2, { message: 'Access level must be between 0 and 2' })
    .optional(),

  isVerified: z.boolean().optional(),
  isProfileComplete: z.boolean().optional(),
  profilePicture: z.string().trim().optional(),
});

export const validateUpdateUser = (req, res, next) => {
  
  const cleansedBody = cleanseData(req.body);
    
  const result = updateUserSchema.safeParse(cleansedBody);

  if (!result.success) {
    const errorMessage = result.error.issues[0]?.message || 'Validation failed';
    return ErrorHandler(res, 400, errorMessage);
  }
  req.body = result.data;

  next();
};
/* ==========================================================================
   EDUCATION VALIDATION
   ========================================================================== */

export const updateEducationSchema = z
  .object({
    degree: z.string().trim().optional(),
    school: z.string().trim().optional(),
    fieldOfStudy: z.string().trim().optional(),
    startDate: z.coerce.date({ invalid_type_error: 'Invalid start date format' }).optional(),
    endDate: z.coerce.date({ invalid_type_error: 'Invalid end date format' }).optional(),
    description: z.string().trim().optional()
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    { message: 'End date must be after or equal to start date', path: ['endDate'] }
  );

export const validateUpdateEducation = (req, res, next) => {
  const cleansedBody = cleanseData(req.body);
  const result = updateEducationSchema.safeParse(cleansedBody);

  if (!result.success) {
    const errorMessage = result.error.issues[0].message;
    return ErrorHandler(res, 400, errorMessage);
  }

  req.body = result.data;
  next();
};

/* ==========================================================================
   CERTIFICATION VALIDATION
   ========================================================================== */

export const updateCertificationSchema = z
  .object({
    certId: z.string().trim().optional(), // Optional: provided when updating an existing cert
    certificationName: z
      .string({ required_error: 'Certification name is required' })
      .trim()
      .min(1, { message: 'Certification name cannot be empty' })
      .optional(),
    certifiedFrom: z
      .string({ required_error: 'Issuing organization is required' })
      .trim()
      .min(1, { message: 'Issuing organization cannot be empty' })
      .optional(),
    startDate: z.coerce.date({ invalid_type_error: 'Invalid start date format' }).optional(),
    endDate: z.coerce.date({ invalid_type_error: 'Invalid end date format' }).optional(),
    certificationImage: z.string().trim().optional()
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    { message: 'End date must be after or equal to start date', path: ['endDate'] }
  );

export const validateUpdateCertification = (req, res, next) => {
  const cleansedBody = cleanseData(req.body);
  const result = updateCertificationSchema.safeParse(cleansedBody);

  if (!result.success) {
    const errorMessage = result.error.issues[0].message;
    return ErrorHandler(res, 400, errorMessage);
  }

  req.body = result.data;
  next();
};

/* ==========================================================================
   Expriences SChema 
   ========================================================================== */
export const updateExperienceSchema = z
  .object({
    _id: z.string().trim().optional(),
    expId: z.string().trim().optional(),
    jobtitle: z
      .string({ required_error: 'Job title is required' })
      .trim()
      .min(1, { message: 'Job title cannot be empty' }),
    company: z
      .string({ required_error: 'Company name is required' })
      .trim()
      .min(1, { message: 'Company name cannot be empty' }),
    startDate: z.coerce.date({ invalid_type_error: 'Invalid start date format' }).optional(),
    endDate: z.coerce.date({ invalid_type_error: 'Invalid end date format' }).optional(),
    isCurrent: z.boolean().optional().default(false),
    description: z.string().trim().optional(),
  })
  .refine(
    (data) => {
      if (data.isCurrent && data.endDate) return false;
      return true;
    },
    { message: 'End date should not be set if you currently work here', path: ['endDate'] }
  )
  .refine(
    (data) => {
      if (!data.isCurrent && data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    { message: 'End date must be after or equal to start date', path: ['endDate'] }
  );

export const validateUpdateExperience = (req, res, next) => {
  const cleansedBody = cleanseData(req.body);
  const result = updateExperienceSchema.safeParse(cleansedBody);

  if (!result.success) {
    const errorMessage = result.error.issues[0].message;
    return ErrorHandler(res, 400, errorMessage);
  }

  req.body = result.data;
  next();
};

/* ==========================================================================
   JWT SCHEMAS
   ========================================================================== */

export const jwtPayloadSchema = z.object({
  id: z.string(),
  iat: z.number().optional(),
  exp: z.number().optional()
});

export const refreshTokenPayload = z.object({
  id: z.string(),
  iat: z.number().optional(),
  exp: z.number().optional()
});