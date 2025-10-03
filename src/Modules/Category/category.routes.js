import express from "express";
import { addCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory } from "./category.controller.js";
import { validateInputs } from "../../Middlewares/validateInputs.js";
import { validateAddCategory, validateParamsId, validateUpdateCategory } from "./category.validation.js";
import { uploadSingle } from "../../services/uploadFile/fileUpload.js";
import productRouter from "../Product/product.routes.js";
import subCategoryRouter from "../SubCategory/subcategory.routes.js";
import { validateToken } from "../../Middlewares/validateToken.js";
import { givePermissionTo } from "../../Middlewares/givePermissionTo.js";
import { findById } from "../../Middlewares/findById.js";
import { categoryModel } from "../../../Database/Models/category.model.js";

const categoryRouter = express.Router({ mergeParams: true });
categoryRouter.use('/:category/products', findById({ model: categoryModel, foreignKey: 'category', from: 'params', necessary: true, objectName: 'category' }), productRouter);
categoryRouter.use('/:category/sub-categories', findById({ model: categoryModel, foreignKey: 'category', from: 'params', necessary: true, objectName: 'category' }), subCategoryRouter);
categoryRouter.route('/').get(getAllCategories).post(validateToken, givePermissionTo('admin', 'super admin')
    , uploadSingle('image', 'uploads/categories/images'),
    validateInputs(validateAddCategory, ['image']), addCategory);
categoryRouter.route('/:id').delete(validateToken, givePermissionTo('admin', 'super admin'),
    validateInputs(validateParamsId), findById({ model: categoryModel, foreignKey: 'id', from: 'params', necessary: true, objectName: 'category' }), deleteCategory)
    .put(validateToken, givePermissionTo('admin', 'super admin'),
        uploadSingle('image', 'uploads/categories/images'),
        validateInputs(validateUpdateCategory, ['image']),
        findById({ model: categoryModel, foreignKey: 'id', from: 'params', necessary: true, objectName: 'category' }),
        updateCategory).get(validateInputs(validateParamsId),
            findById({ model: categoryModel, foreignKey: 'id', from: 'params', necessary: true, objectName: 'category' })
            , getSingleCategory);

export default categoryRouter;