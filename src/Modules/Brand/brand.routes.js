import express from "express";
import { validateInputs } from "../../Middlewares/validateInputs.js";
import { uploadSingle } from "../../services/uploadFile/fileUpload.js";
import { addBrand, deleteBrand, getAllBrands, getSingleBrand, updateBrand } from "./brand.controller.js";
import { validateAddBrand, validateParamsId, validateUpdateBrand } from "./brand.validation.js";
import productRouter from "../Product/product.routes.js";
import { validateToken } from "../../Middlewares/validateToken.js";
import { givePermissionTo } from "../../Middlewares/givePermissionTo.js";
import { findById } from "../../Middlewares/findById.js";
import { brandModel } from "../../../Database/Models/brand.model.js";

const brandRouter = express.Router({ mergeParams: true });
brandRouter.use('/:brand/products', findById({ model: brandModel, foreignKey: 'brand', from: 'params', necessary: true, objectName: 'Brand' }), productRouter);
brandRouter.route('/').get(getAllBrands).post(validateToken, givePermissionTo('admin', 'super admin'), uploadSingle('logo', 'uploads/brands/logos'),
    validateInputs(validateAddBrand, ['logo']), addBrand);
brandRouter.route('/:id').delete(validateToken, givePermissionTo('admin', 'super admin'), validateInputs(validateParamsId),
    findById({ model: brandModel, foreignKey: 'id', from: 'params', necessary: true, objectName: 'brand' })
    , deleteBrand)
    .put(validateToken, givePermissionTo('admin', 'super admin'), uploadSingle('logo', 'uploads/brands/logos'), validateInputs(validateUpdateBrand, ['logo']),
        findById({ model: brandModel, foreignKey: 'id', from: 'params', necessary: true, objectName: 'brand' }), updateBrand).get(validateInputs(validateParamsId),
            findById({
                model: brandModel, foreignKey: 'id'
                , from: 'params', necessary: true, objectName: 'Brand'
            }), getSingleBrand);


export default brandRouter;


