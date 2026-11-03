import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userCertificationSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    userId: { type: String, ref: "User", required: true },
    certificationName: { type: String, required: true },
    certifiedFrom: { type: String, required: true },
    certificationImage: { type: String, default: null },
    startDate: Date,
    endDate: Date,
  },
  {
    timestamps: true,
  }
);

const Certification = mongoose.model("Certification", userCertificationSchema);

export default Certification;