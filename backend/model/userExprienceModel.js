import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { boolean } from "zod";

const userExperienceSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    userId: { type: String, ref: "User", required: true, index: true },
    jobtitle: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    startDate: { type: Date },
    endDate: { type: Date, default: null },
    isCurrent: { type: Boolean, default: false },
    description: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

const Experience = mongoose.model("Experience", userExperienceSchema);

export default Experience;