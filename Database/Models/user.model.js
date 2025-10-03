import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const table = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "name of user is required!!"],
    },
    email: {
        type: String,
        trim: true,
        required: [true, "name of user is required!!"],
        unique: [true, "this email is used before!!"],
    },
    password: {
        required: true,
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'super admin'],
        default: 'user'
    },
    passwordLatestChangeTime: Date,
    wishlist: [{
        type: mongoose.Types.ObjectId,
        ref: 'products'
    }],
    addresses: [{
        street: String,
        phone: String,
        city: String
    }]

}, { timestamps: true });

table.pre('save', function () {
    this.password = bcrypt.hashSync(this.password, 8);
});

table.pre(['findOneAndUpdate', 'findByIdAndUpdate'], function () {
    if (this._update.password) {
        this._update.password = bcrypt.hashSync(this._update.password, 8);
    }
});


export const userModel = mongoose.model('users', table);
