
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";



const userEmployerSchema = new mongoose.Schema(
    {
        _id: {type: String, default: () => uuidv4()},
        userId: {type: String,ref: "User", required: true,index: true},
        companyName: {type: String, required: true},
        industry: {type: String, required: true},
        founded: {type: Date,required: true},
        location: {type:String, required: true},
        companySize: {type: Number,required: true},
        isEmployer: {type: Boolean, default: false}
    })


userEmployerSchema.virtual('year').get(() => {
    return this.founded ?new Date(this.founded).getFullYear() : null 
})

const Employer = mongoose.model("Employer", userEmployerSchema);

export default Employer;