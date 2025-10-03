import express from "express";
import { validateToken } from "../../Middlewares/validateToken.js";
import { findById } from "../../Middlewares/findById.js";
import { validateInputs } from "../../Middlewares/validateInputs.js";
import { validateAddToCart, validateParamsId, validateUpdateQuantity } from "./cart.validation.js";
import { productModel } from "../../../Database/Models/product.model.js";
import { addToCart, applyCoupon, clearUserCart, getLoggedUserCart, removeFromCart, updateQuantity } from "./cart.controller.js";


const cartRouter = express.Router();

cartRouter.use(validateToken);

cartRouter.route('/').patch(validateInputs(validateAddToCart),
    findById({ model: productModel, foreignKey: 'product', from: 'body', necessary: true, objectName: 'product' }), addToCart)
    .get(getLoggedUserCart).delete(clearUserCart);
cartRouter.route('/:id').delete(validateInputs(validateParamsId), removeFromCart).put(validateInputs(validateUpdateQuantity), updateQuantity);
cartRouter.route('/applyCoupon').patch(applyCoupon);
export default cartRouter;