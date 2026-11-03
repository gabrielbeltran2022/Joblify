import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String, default: null, required:false },
    suffix: { type: String, default: null, required: false },
    profession: { type: String },
    dateOfBirth: { type: Date },
    contact: { type: String },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address'
      ]
    },
    jobtitle: { type: String, required: true },
    address: { type: String },
    gender: {
      type: String,
      enum: { values: ['Male', 'Female'], message: "Gender must be female or male" },
      required: true,
      default: null
    },
    accessLevel: {
      type: Number,
      required: true,
      enum: {
        values: [0, 1, 2],
        message: "{VALUE} is not a valid access level. Allowed values are 0, 1, or 2"
      },
      default: 0
    },
    isVerified: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    profilePicture: { type: String, default: "/uploads/default_profile.png" },
  },
  {
    timestamps: true
  }
);

export default mongoose.model('userModel', userSchema);