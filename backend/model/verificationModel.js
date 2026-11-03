import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';



const verificationSchema = new mongoose.Schema({
     _id: {type: String, default: () => uuidv4()},
    email: { 
        type: String, 
        required: true,
        lowercase: true, 
        unique: true 
    },
    code: { 
        type: String, 
        required: true 
    },
    expiresAt: { 
        type: Date, 
        required: true 
    }
}, { timestamps: true });

verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Verification', verificationSchema);