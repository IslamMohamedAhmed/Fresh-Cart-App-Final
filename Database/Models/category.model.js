import mongoose from "mongoose";


const table = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, "this name was used before"],
        trim: true,
        required: [true, "name of category is required!!"],
        minLength: [2, "too short name for a category"]
    },
    slug: {
        lowercase: true,
        type: String,
        required: true
    },
    image: String,
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    }
}, { timestamps: true });

table.post('init', (doc) => {
    doc.image = process.env.BASE_URL + "/categories/images/" + doc.image;
});

export const categoryModel = mongoose.model('categories', table);