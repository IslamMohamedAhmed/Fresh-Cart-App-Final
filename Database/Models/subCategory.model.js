import mongoose from "mongoose";


const table = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, "this name was used before"],
        trim: true,
        required: [true, "name of sub-category is required!!"],
        minLength: [2, "too short name for a sub-category"]
    },
    slug: {
        lowercase: true,
        type: String,
        required: true
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'categories'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    }
}, { timestamps: true });


export const subCategoryModel = mongoose.model('sub-categories', table);

