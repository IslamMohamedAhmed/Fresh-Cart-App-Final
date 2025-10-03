import { cartModel } from "../../../Database/Models/cart.model.js";
import { orderModel } from "../../../Database/Models/order.model.js";
import { productModel } from "../../../Database/Models/product.model.js";
import { catchError } from "../../Middlewares/catchError.js";
import { appError } from "../../Utils/appError.js";
import Stripe from "stripe";

const createOrder = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let cartExist = await cartModel.findOne({ user: tokenUser.id });
    if (!cartExist) return next(new appError('user cart is empty!!', 409));
    let totalOrderPrice = cartExist.totalPriceAfterDiscount ? cartExist.totalPriceAfterDiscount : cartExist.totalPrice;
    let order = new orderModel({
        user: tokenUser.id,
        orderItems: cartExist.cartItems,
        totalOrderPrice,
        shippingAddress: req.body.shippingAddress
    });

    await order.save();
    let options = cartExist.cartItems.map(item => {
        return ({
            "updateOne": {
                "filter": { _id: item.product },
                "update": { $inc: { sold: item.quantity, quantity: -item.quantity } }
            }
        });
    });
    await productModel.bulkWrite(options);
    await cartModel.findOneAndDelete({ user: cartExist.user });
    res.json({ message: 'success', order });
});


const getUserSpecificOrder = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let order = await orderModel.findById(req.params.id);
    if (!tokenUser.id == order.user) return next(new appError('You are not authorized to review that order!!', 401));
    res.json({ message: 'success', order });
});


const getUserOrders = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let orders = await orderModel.find({ user: tokenUser.id });
    res.json({ message: 'success', orders });
});

const getAllOrders = catchError(async (req, res, next) => {
    let filterObj = {};
    if (req.params.user) {
        filterObj.user = req.params.user;
    }
    let orders = await orderModel.find(filterObj);
    res.json({ message: 'success', orders });
});


const addCheckoutSession = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    console.log(tokenUser.id);
    let cartExist = await cartModel.findOne({ user: tokenUser.id });
    if (!cartExist) return next(new appError('user cart is empty!!', 409));
    let totalOrderPrice = cartExist.totalPriceAfterDiscount ? cartExist.totalPriceAfterDiscount : cartExist.totalPrice;
    let stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    let session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    unit_amount: totalOrderPrice * 100, // Stripe expects amount in cents
                    product_data: {
                        name: "Cart Checkout",
                    },
                },
                quantity: 1,
            }
        ],
        mode: 'payment',
        success_url: "https://www.google.com/",
        cancel_url: "https://www.facebook.com/",
        customer_email: tokenUser.email,
        client_reference_id: cartExist._id.toString(),
        metadata: req.body.shippingAddress
    });

    res.json({ message: 'success', session })


});


















export {
    createOrder,
    getAllOrders,
    getUserSpecificOrder,
    getUserOrders,
    addCheckoutSession
}