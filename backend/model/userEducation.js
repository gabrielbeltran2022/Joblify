import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userEducationSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() },
  userId: { type: String, ref: "User", required: true },
  schoolName: { type: String, required: true },
  degree: { type: String, required: true },
  fieldStudy: {type: String, required: true},
  educationLevel: {type: String,required: true},
  startDate: Date,
  endDate: Date
});

const Education = mongoose.model("Education", userEducationSchema);

export default Education;