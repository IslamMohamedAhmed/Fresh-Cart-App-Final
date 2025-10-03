import express from "express";
import { validateInputs } from "../../Middlewares/validateInputs.js";
import { uploadFields } from "../../services/uploadFile/fileUpload.js";
import { addProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from "./product.controller.js";
import { validateAddProduct, validateParamsId, validateUpdateProduct } from "./product.validation.js";
import { validateToken } from "../../Middlewares/validateToken.js";
import { givePermissionTo } from "../../Middlewares/givePermissionTo.js";
import { productModel } from "../../../Database/Models/product.model.js";
import { findById } from "../../Middlewares/findById.js";
import { categoryModel } from "../../../Database/Models/category.model.js";
import { subCategoryModel } from "../../../Database/Models/subCategory.model.js";
import { brandModel } from "../../../Database/Models/brand.model.js";
import reviewRouter from "../Review/review.routes.js";


const productRouter = express.Router({ mergeParams: true });
productRouter.use('/:product/reviews', findById({ model: productModel, foreignKey: 'product', from: 'params', necessary: true, objectName: 'product' }), reviewRouter);
productRouter.route('/').get(getAllProducts).post(validateToken, givePermissionTo('admin', 'super admin'), uploadFields([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 5 }
], 'uploads/products/images'),
    validateInputs(validateAddProduct, ['imageCover', 'images']), findById({ model: categoryModel, foreignKey: 'category', from: 'body', necessary: true, objectName: 'category' }),
    findById({ model: subCategoryModel, foreignKey: 'subcategory', from: 'body', necessary: true, objectName: 'subcategory' }),
    findById({ model: brandModel, foreignKey: 'brand', from: 'body', necessary: true, objectName: 'brand' }), addProduct);
productRouter.route('/:id').delete(validateToken, givePermissionTo('admin', 'super admin'), validateInputs(validateParamsId),
    findById({ model: productModel, foreignKey: 'id', from: 'params', necessary: true, objectName: 'product' }), deleteProduct)
    .put(validateToken, givePermissionTo('admin', 'super admin'), uploadFields([
        { name: "imageCover", maxCount: 1 },
        { name: "images", maxCount: 5 }
    ], 'uploads/products/images'), validateInputs(validateUpdateProduct),
        findById({ model: productModel, foreignKey: 'id', from: 'params', necessary: true, objectName: 'product' }),
        findById({ model: categoryModel, foreignKey: 'category', from: 'body', necessary: false, objectName: 'category' }),
        findById({ model: subCategoryModel, foreignKey: 'subcategory', from: 'body', necessary: false, objectName: 'subcategory' }),
        findById({ model: brandModel, foreignKey: 'brand', from: 'body', necessary: false, objectName: 'brand' }), updateProduct).get(validateInputs(validateParamsId),
            findById({ model: productModel, foreignKey: 'id', from: 'params', necessary: true, objectName: 'product' })
            , getSingleProduct);

export default productRouter;


