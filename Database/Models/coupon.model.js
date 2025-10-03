import mongoose from "mongoose";


const table = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    expiresAt: Date,
    discount: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    }
}, { timestamps: true });


export const couponModel = mongoose.model('coupons', table);



