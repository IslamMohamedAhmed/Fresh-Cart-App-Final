import express from "express";
import { validateToken } from "../../Middlewares/validateToken.js";
import { validateInputs } from "../../Middlewares/validateInputs.js";
import { validateCreateOrder } from "./order.validation.js";
import { addCheckoutSession, createOrder, getAllOrders, getUserSpecificOrder } from "./order.controller.js";
import { givePermissionTo } from "../../Middlewares/givePermissionTo.js";
import { findById } from "../../Middlewares/findById.js";
import { orderModel } from "../../../Database/Models/order.model.js";



const orderRouter = express.Router({ mergeParams: true });

orderRouter.use(validateToken);
orderRouter.route('/').post(validateInputs(validateCreateOrder), createOrder).get(givePermissionTo('super admin'), getAllOrders);
orderRouter.route('/:id').get(findById({ model: orderModel, foreignKey: 'id', from: 'params', necessary: true, objectName: 'order' }), getUserSpecificOrder);
orderRouter.route('/checkoutSession').post(addCheckoutSession);
export default orderRouter;