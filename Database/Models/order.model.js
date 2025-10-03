import mongoose from "mongoose";


const table = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    orderItems: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: 'products'
            },
            quantity: Number,
            price: Number
        }
    ],
    totalOrderPrice: Number,
    shippingAddress: {
        street: String,
        city: String,
        phone: String
    },
    paymentType: {
        type: String,
        enum: ['cash', 'card'],
        default: 'cash'
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: Date,
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: Date

}, { timestamps: true });


export const orderModel = mongoose.model('orders', table);