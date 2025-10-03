import slugify from "slugify";
import { catchError } from "../../Middlewares/catchError.js";
import { appError } from "../../Utils/appError.js";
import { productModel } from "../../../Database/Models/product.model.js";
import { QueryBuilder } from "../../Utils/queryBuilder.js";
const addProduct = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    req.body.slug = slugify(req.body.title);
    req.body.imageCover = req.files.imageCover[0].filename;
    req.body.images = req.files.images.map(img => img.filename);
    req.body.createdBy = tokenUser.id;
    let product = new productModel(req.body);
    await product.save();
    return res.json({ message: 'success', product });
});

const getSingleProduct = catchError(async (req, res, next) => {
    let product = await productModel.findById(req.params.id);
    res.json({ message: 'success', product });
});

const updateProduct = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    if (req.body.title) req.body.slug = slugify(req.body.title);
    if (req.files) {
        if (req.files.imageCover) req.body.imageCover = req.files.imageCover[0].filename;
        if (req.files.images) req.body.images = req.files.images.map(img => img.filename);
    }
    let result = await productModel.findById(req.params.id);
    if (result.createdBy == tokenUser.id) {
        let product = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: 'success', product });
    }
    else {

        next(new appError('you are not authorized to update that product', 401));
    }

});

const deleteProduct = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let result = await productModel.findById(req.params.id);

    if (result.createdBy == tokenUser.id || tokenUser.role == 'super admin') {
        let product = await productModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'success', product });
    }
    else {

        next(new appError('you are not authorized to delete that product', 401));
    }


});

const getAllProducts = catchError(async (req, res, next) => {
    let filter = {};
    if (req.params.category) filter.category = req.params.category;
    if (req.params.subcategory) filter.subcategory = req.params.subcategory;
    if (req.params.brand) filter.brand = req.params.brand;
    if (req.params.user) filter.createdBy = req.params.user;
    let queryBuilder = new QueryBuilder(productModel.find(filter), req.query);
    queryBuilder.filter().sort().fields().search();
    await queryBuilder.pagination();
    let products = await queryBuilder.mongooseQuery;
    res.json({
        message: "success",
        page: queryBuilder.pageNumber,
        totalPages: queryBuilder.totalPages,
        totalItems: queryBuilder.totalItems,
        pageLimit: queryBuilder.pageLimit,
        data: products                        // The actual data for this page
    });
});



export {
    addProduct,
    deleteProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct
}
