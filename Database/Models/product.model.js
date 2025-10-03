import mongoose from "mongoose";


const table = new mongoose.Schema({
    title: {
        type: String,
        unique: [true, "this title was used before"],
        trim: true,
        required: [true, "title of product is required!!"],
        minLength: [2, "too short title for a product"],
        maxLength: [200, "too long title for a product"]
    },
    slug: {
        lowercase: true,
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: [true, "description of product is required!!"],
        minLength: [10, "too short description for a product"],
        maxLength: [500, "too long description for a product"]
    },
    imageCover: String,
    images: {
        type: [String],
        default: [],
    },
    price: {
        type: Number,
        min: 0,
        required: true,
    },
    priceAfterDiscount: {
        type: Number,
        min: 0
    },
    quantity: {
        type: Number,
        min: 0,
        default: 0
    },
    sold: Number,
    rateAverage: {
        type: Number,
        min: 0,
        max: 5
    },
    rateCount: {
        type: Number,
        min: 0,
        default: 0
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'categories',

    },
    subCategory: {
        type: mongoose.Types.ObjectId,
        ref: 'sub-categories'
    },
    brand: {
        type: mongoose.Types.ObjectId,
        ref: 'brands'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    }
}, { timestamps: true, toJSON: { virtuals: true } });

table.virtual('productReviews', {
    ref: 'reviews',
    localField: '_id',
    foreignField: 'product'
});
table.pre('findOne', function () {
    this.populate('productReviews','text -product');
});

table.post('init', (doc) => {
    doc.imageCover = process.env.BASE_URL + "/products/images/" + doc.imageCover;
    doc.images = doc.images.map(img => process.env.BASE_URL + "/products/images/" + img);
});

export const productModel = mongoose.model('products', table);
