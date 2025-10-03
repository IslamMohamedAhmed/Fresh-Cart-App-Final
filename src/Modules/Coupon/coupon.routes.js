import express from "express";
import { validateInputs } from "../../Middlewares/validateInputs.js";
import { findById } from "../../Middlewares/findById.js";
import { validateToken } from "../../Middlewares/validateToken.js";
import { givePermissionTo } from "../../Middlewares/givePermissionTo.js";
import { userModel } from "../../../Database/Models/user.model.js";
import userRouter from "../User/user.routes.js";
import { addCoupon, deleteCoupon, getAllCoupons, getSingleCoupon, updateCoupon } from "./coupon.controller.js";
import { validateAddCoupon, validateParamsId, validateUpdateCoupon } from "./coupon.validation.js";
import { couponModel } from "../../../Database/Models/coupon.model.js";

const couponRouter = express.Router({ mergeParams: true });

couponRouter.use('/:user/products', findById({ model: userModel, foreignKey: 'user', from: 'params', necessary: true, objectName: 'user' })
    , userRouter);
couponRouter.route('/').get(getAllCoupons).post(validateToken, givePermissionTo('admin', 'super admin'),
    validateInputs(validateAddCoupon), addCoupon);
couponRouter.route('/:id').delete(validateToken, givePermissionTo('admin', 'super admin'),
    validateInputs(validateParamsId), findById({ model: couponModel, foreignKey: 'id', from: 'params', necessary: true, objectName: 'coupon' }), deleteCoupon)
    .put(validateToken, givePermissionTo('admin', 'super admin'),
        validateInputs(validateUpdateCoupon), findById({ model: couponModel, foreignKey: 'id', from: 'params', necessary: true, objectName: 'coupon' }), updateCoupon)
    .get(validateInputs(validateParamsId), findById({ model: couponModel, foreignKey: 'id', from: 'params', necessary: true, objectName: 'coupon' }), getSingleCoupon);

export default couponRouter;