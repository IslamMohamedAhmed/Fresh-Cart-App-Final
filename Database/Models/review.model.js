import mongoose from "mongoose";


const table = new mongoose.Schema({
    text: {
        type: String,
        trim: true,
        required: [true, "review text is required!!"],
        minLength: [2, "too short text for a review"]
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'products'
    },
    rate: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    }
}, { timestamps: true });


table.pre(/^find$/, function () {
    this.populate('createdBy', "name");
});


export const reviewModel = mongoose.model('reviews', table);