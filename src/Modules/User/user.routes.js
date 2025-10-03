import express from "express";
import { validateInputs } from "../../Middlewares/validateInputs.js";
import { addUser, deleteUser, getAllUsers, getSingleUser, updateUser } from "./user.controller.js";
import { validateAddUser, validateParamsId, validateUpdateUser } from "./user.validation.js";
import { validateToken } from "../../Middlewares/validateToken.js";
import productRouter from "../Product/product.routes.js";
import categoryRouter from "../Category/category.routes.js";
import subCategoryRouter from "../SubCategory/subcategory.routes.js";
import brandRouter from "../Brand/brand.routes.js";
import { givePermissionTo } from "../../Middlewares/givePermissionTo.js";
import { findById } from "../../Middlewares/findById.js";
import { userModel } from "../../../Database/Models/user.model.js";
import reviewRouter from "../Review/review.routes.js";
import orderRouter from "../Order/order.routes.js";

const userRouter = express.Router();
userRouter.use(validateToken);
userRouter.use(givePermissionTo('super admin'));
userRouter.use('/:user/products', findById({ model: userModel, foreignKey: 'user', from: 'params', necessary: true }), productRouter);
userRouter.use('/:user/categories', findById({ model: userModel, foreignKey: 'user', from: 'params', necessary: true }), categoryRouter);
userRouter.use('/:user/sub-categories', findById({ model: userModel, foreignKey: 'user', from: 'params', necessary: true }), subCategoryRouter);
userRouter.use('/:user/brands', findById({ model: userModel, foreignKey: 'user', from: 'params', necessary: true }), brandRouter);
userRouter.use('/:user/reviews', findById({ model: userModel, foreignKey: 'user', from: 'params', necessary: true, objectName: 'user' }), reviewRouter);
userRouter.use('/:user/orders', findById({ model: userModel, foreignKey: 'user', from: 'params', necessary: true, objectName: 'user' }), orderRouter);
userRouter.route('/').get(getAllUsers).post(validateInputs(validateAddUser), addUser);
userRouter.route('/:id').delete(validateInputs(validateParamsId), findById({ model: userModel, foreignKey: 'id', from: 'params', necessary: true }), deleteUser)
    .put(validateInputs(validateUpdateUser), findById({ model: userModel, foreignKey: 'id', from: 'params', necessary: true }), updateUser)
    .get(validateInputs(validateParamsId), findById({ model: userModel, foreignKey: 'id', from: 'params', necessary: true }), getSingleUser);

export default userRouter;