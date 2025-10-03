import express from "express";
import { validateInputs } from "../../Middlewares/validateInputs.js";
import { findById } from "../../Middlewares/findById.js";
import { addReview, deleteReview, getAllReviews, getSingleReview, updateReview } from "./review.controller.js";
import { validateToken } from "../../Middlewares/validateToken.js";
import { validateAddReview, validateParamsId, validateUpdateReview } from "./review.validation.js";
import { productModel } from "../../../Database/Models/product.model.js";
import { reviewModel } from "../../../Database/Models/review.model.js";

const reviewRouter = express.Router({ mergeParams: true });
reviewRouter.route('/').get(getAllReviews).post(validateToken, validateInputs(validateAddReview),
    findById({ model: productModel, foreignKey: 'product', from: 'body', necessary: true, objectName: 'product' }), addReview);
reviewRouter.route('/:id').delete(validateToken, validateInputs(validateParamsId),
    findById({ model: reviewModel, foreignKey: 'id', from: 'params', necessary: true, objectName: 'review' }), deleteReview)
    .put(validateInputs(validateUpdateReview),
        findById({ model: reviewModel, foreignKey: 'id', from: 'params', necessary: true, objectName: 'review' }), updateReview)
    .get(validateInputs(validateParamsId),
        findById({ model: reviewModel, foreignKey: 'id', from: 'params', necessary: true, objectName: 'review' }), getSingleReview);

export default reviewRouter;



