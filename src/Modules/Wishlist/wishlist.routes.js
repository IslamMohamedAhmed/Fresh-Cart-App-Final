import express from "express";
import { validateInputs } from "../../Middlewares/validateInputs.js";
import { addToWishlist, getWishlist, removeFromWishlist } from "./wishlist.controller.js";
import { validateToken } from "../../Middlewares/validateToken.js";
import { validateAddToWishlist, validateParamsId } from "./wishlist.validation.js";
import { findById } from "../../Middlewares/findById.js";
import { productModel } from "../../../Database/Models/product.model.js";


const wishlistRouter = express.Router();
wishlistRouter.route('/').patch(validateToken, validateInputs(validateAddToWishlist),
    findById({ model: productModel, foreignKey: 'product', from: 'body', necessary: true, objectName: 'product' }), addToWishlist)
    .get(validateToken, getWishlist);

wishlistRouter.route('/:id').delete(validateToken, validateInputs(validateParamsId)
    , findById({ model: productModel, foreignKey: 'id', from: 'params', necessary: true, objectName: 'product' }), removeFromWishlist);
export default wishlistRouter;



