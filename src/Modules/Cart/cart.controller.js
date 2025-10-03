import { cartModel } from "../../../Database/Models/cart.model.js";
import { couponModel } from "../../../Database/Models/coupon.model.js";
import { productModel } from "../../../Database/Models/product.model.js";
import { catchError } from "../../Middlewares/catchError.js";
import { appError } from "../../Utils/appError.js";


const addToCart = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let cartExist = await cartModel.findOne({ user: tokenUser.id });
    let product = await productModel.findById(req.body.product);
    if (!cartExist) {
        if (req.body.quantity > product.quantity) {
            next(new appError('invalid quatity!!', 401));
        }
        else {
            req.body.price = product.price;
            let cart = new cartModel({
                user: tokenUser.id,
                cartItems: [req.body]
            });
            cart.totalPrice = cart.cartItems.reduce((acc, item) => {
                return acc + (item.quantity * item.price);
            }, 0);
            if (cart.discount) {
                cart.totalPriceAfterDiscount = cart.totalPrice * (1 - cart.discount / 100);
            }
            await cart.save();
            res.json({ message: 'success', cart });
        }
    }
    else {
        let result = await cartModel.findOne({ user: tokenUser.id });
        let productExist = result.cartItems.find(item => item.product.equals(product._id));
        if (productExist) {
            if (productExist.quantity + req.body.quantity > product.quantity) {
                return next(new appError('invalid quantity!!', 401));
            }
            else {
                productExist.quantity += req.body.quantity;
            }
        }
        else {
            if (req.body.quantity > product.quantity) {
                next(new appError('invalid quantity!!', 401));
            }
            else {
                req.body.price = product.price;
                result.cartItems.push(req.body);
            }
        }
        result.totalPrice = result.cartItems.reduce((acc, item) => {
            return acc + (item.quantity * item.price);
        }, 0);
        if (result.discount) {
            result.totalPriceAfterDiscount = result.totalPrice * (1 - result.discount / 100);
        }
        await result.save();
        res.json({ message: 'success', result });
    }
});

const removeFromCart = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let cart = await cartModel.findOne({ user: tokenUser.id });
    let productExist = cart.cartItems.find(item => item._id.equals(req.params.id));
    if (productExist) {
        let result = await cartModel.findOneAndUpdate({ user: tokenUser.id }, { $pull: { cartItems: { _id: req.params.id } } }, { new: true });
        result.totalPrice = result.cartItems.reduce((acc, item) => {
            return acc + (item.quantity * item.price);
        }, 0);
        await result.save();
        res.json({ message: 'success', result });
    }
    else {
        next(new appError('product is not found in your cart!!', 404));
    }
});

const updateQuantity = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let cart = await cartModel.findOne({ user: tokenUser.id });
    let productExist = cart.cartItems.find(item => item.product.equals(req.params.id));
    if (productExist) {
        let product = await productModel.findById(productExist.product);
        if (req.body.quantity > product.quantity) {
            return next(new appError('invalid quantity!!', 401));
        }
        else {
            productExist.quantity = req.body.quantity;
            cart.totalPrice = cart.cartItems.reduce((acc, item) => {
                return acc + (item.quantity * item.price);
            }, 0);
            if (cart.discount) {
                cart.totalPriceAfterDiscount = cart.totalPrice * (1 - cart.discount / 100);
            }
            await cart.save();
            res.json({ message: 'success', cart });

        }
    }
    else {
        next(new appError('product is not found in your cart!!', 404));
    }

});

const getLoggedUserCart = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let cart = await cartModel.findOne({ user: tokenUser.id }).populate('cartItems.product');
    if (cart) {
        res.json({ message: 'success', cart });
    }
    else {
        next(new appError('your cart is empty!!', 401));
    }
});

const clearUserCart = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let cart = await cartModel.findOne({ user: tokenUser.id });
    if (cart) {
        let result = await cartModel.findOneAndDelete({ user: tokenUser.id });
        res.json({ message: 'success', result });
    }
    else {
        next(new appError('your cart is already empty!!', 401));
    }
});

const applyCoupon = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let coupon = await couponModel.findOne({ code: req.body.coupon, expiresAt: { $gte: Date.now() } });
    if (coupon) {
        let cart = await cartModel.findOne({ user: tokenUser.id });
        if (cart) {
            cart.discount = coupon.discount;
            cart.totalPriceAfterDiscount = cart.totalPrice * (1 - cart.discount / 100);
            await cart.save();
            res.json({ message: 'success', cart });
        }
        else {
            next(new appError('cart is not found!!', 404));
        }
    }
    else {
        next(new appError('coupon is not found!!', 404));
    }
});




export {
    addToCart,
    removeFromCart,
    updateQuantity,
    getLoggedUserCart,
    clearUserCart,
    applyCoupon
}