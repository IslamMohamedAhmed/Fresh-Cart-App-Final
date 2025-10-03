import express from "express";
import { validateInputs } from "../../Middlewares/validateInputs.js";
import { addSubCategory, deleteSubCategory, getAllSubCategories, getSingleSubCategory, updateSubCategory } from "./subcategory.controller.js";
import { validateAddSubCategory, validateParamsId, validateUpdateSubCategory } from "./subcategory.validation.js";
import productRouter from "../Product/product.routes.js";
import { subCategoryModel } from "../../../Database/Models/subCategory.model.js";
import { categoryModel } from "../../../Database/Models/category.model.js";
import { findById } from "../../Middlewares/findById.js";
import { validateToken } from "../../Middlewares/validateToken.js";
import { givePermissionTo } from "../../Middlewares/givePermissionTo.js";

const subCategoryRouter = express.Router({ mergeParams: true });

subCategoryRouter.use('/:subcategory/products', findById({ model: subCategoryModel, foreignKey: 'subcategory', from: 'params', necessary: true, objectName: 'subcategory' })
    , productRouter);
subCategoryRouter.route('/').get(getAllSubCategories).post(validateToken, givePermissionTo('admin', 'super admin'),
    validateInputs(validateAddSubCategory),
    findById({ model: categoryModel, foreignKey: 'category', from: 'body', necessary: true, objectName: 'category' }), addSubCategory);
subCategoryRouter.route('/:id').delete(validateToken, givePermissionTo('admin', 'super admin'),
    validateInputs(validateParamsId),
    findById({ model: subCategoryModel, foreignKey: 'id', from: 'params', necessary: true, objectName: 'subcategory' }), deleteSubCategory)
    .put(validateToken, givePermissionTo('admin', 'super admin'),
        validateInputs(validateUpdateSubCategory),
        findById({ model: subCategoryModel, foreignKey: 'id', from: 'params', necessary: true, objectName: 'subcategory' }),
        findById({ model: categoryModel, foreignKey: 'category', from: 'body', necessary: false, objectName: 'category' }), updateSubCategory)
    .get(validateInputs(validateParamsId),
        findById({ model: subCategoryModel, foreignKey: 'id', from: 'params', necessary: true, objectName: 'subcategory' }), getSingleSubCategory);

export default subCategoryRouter;


