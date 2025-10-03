import mongoose from "mongoose";


const table = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    cartItems: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: 'products'
            },
            quantity: {
                type: Number,
                default: 1
            },
            price: Number
        }
    ],
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    discount: Number
}, { timestamps: true });


export const cartModel = mongoose.model('carts', table);